import argparse
import hashlib
import json
import os
import re
import shutil
import socket
import subprocess
import uuid
from pathlib import Path

import psycopg2
from psycopg2 import sql

ROOT = Path(__file__).resolve().parents[1]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("dump", type=Path)
    parser.add_argument("--resume-empty-cluster", action="store_true")
    args = parser.parse_args()
    dump = args.dump.resolve()
    private_root = (ROOT / "backups/heroku-current").resolve()
    if not dump.is_relative_to(private_root) or not dump.is_file():
        raise SystemExit(
            "Dump must exist under the ignored backups/heroku-current directory."
        )
    cluster = private_root / "validation-postgres"
    if cluster.exists() and not args.resume_empty_cluster:
        raise SystemExit("Validation cluster already exists; refusing to overwrite it.")
    executables = {}
    for name in ("initdb", "pg_ctl", "createdb", "pg_restore"):
        executable = shutil.which(name)
        if executable is None:
            raise SystemExit(f"PostgreSQL binary {name} must be on PATH.")
        executables[name] = executable
    with socket.socket() as probe:
        probe.bind(("127.0.0.1", 0))
        port = probe.getsockname()[1]
    env = {key: value for key, value in os.environ.items() if not key.startswith("PG")}
    database = "portfolio_restore_" + uuid.uuid4().hex[:8]
    flags = subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0

    def run(name, *arguments):
        stdout_path = private_root / f"validation-{name}-stdout.log"
        stderr_path = private_root / f"validation-{name}-stderr.log"
        with stdout_path.open("wb") as stdout, stderr_path.open("wb") as stderr:
            result = subprocess.run(
                [executables[name], *map(str, arguments)],
                env=env,
                stdout=stdout,
                stderr=stderr,
                creationflags=flags,
            )
        if result.returncode:
            raise RuntimeError(f"{name} failed; diagnostics saved privately.")
        return stdout_path.read_text(encoding="utf-8", errors="replace")

    if not args.resume_empty_cluster:
        run(
            "initdb",
            "-D",
            cluster,
            "-U",
            "portfolio_validation",
            "--auth=trust",
            "--encoding=UTF8",
            "--no-locale",
        )
    started = False
    try:
        run(
            "pg_ctl",
            "-D",
            cluster,
            "-l",
            private_root / "validation-postgres.log",
            "-o",
            f"-h 127.0.0.1 -p {port}",
            "-w",
            "start",
        )
        started = True
        run(
            "createdb",
            "-h",
            "127.0.0.1",
            "-p",
            port,
            "-U",
            "portfolio_validation",
            database,
        )
        catalog = run("pg_restore", "--list", dump)
        omitted = []
        selected = []
        for line in catalog.splitlines():
            if not line.startswith(";") and (
                any(
                    word in line
                    for word in (
                        " EXTENSION ",
                        " COMMENT - EXTENSION ",
                        " ACL ",
                        " DEFAULT ACL ",
                    )
                )
                or re.search(r'\bSCHEMA - (?:"public"|public)\s', line)
            ):
                omitted.append(line)
                selected.append(";" + line)
            else:
                selected.append(line)
        list_file = private_root / "restore-selection.list"
        list_file.write_text("\n".join(selected) + "\n", encoding="utf-8")
        run(
            "pg_restore",
            "--no-owner",
            "--no-acl",
            "--exit-on-error",
            "--use-list",
            list_file,
            "-h",
            "127.0.0.1",
            "-p",
            port,
            "-U",
            "portfolio_validation",
            "-d",
            database,
            dump,
        )
        connection = psycopg2.connect(
            host="127.0.0.1", port=port, user="portfolio_validation", dbname=database
        )
        try:
            with connection.cursor() as cursor:
                cursor.execute("SET TIME ZONE 'UTC'")
                cursor.execute(
                    "SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename"
                )
                tables = [row[0] for row in cursor.fetchall()]
                counts = {}
                table_hashes = {}
                for table in tables:
                    cursor.execute(
                        sql.SQL("SELECT * FROM public.{}").format(sql.Identifier(table))
                    )
                    if cursor.description is None:
                        raise RuntimeError(
                            "The table query returned no column metadata."
                        )
                    columns = [item.name for item in cursor.description]
                    records = [
                        dict(zip(columns, row, strict=True))
                        for row in cursor.fetchall()
                    ]
                    records.sort(
                        key=lambda row: json.dumps(row, default=str, sort_keys=True)
                    )
                    counts[table] = len(records)
                    table_hashes[table] = hashlib.sha256(
                        json.dumps(records, default=str, sort_keys=True).encode("utf-8")
                    ).hexdigest()
                cursor.execute(
                    "SELECT id, image FROM public.products_product ORDER BY id"
                )
                images = [
                    {"product_id": row[0], "reference": row[1]}
                    for row in cursor.fetchall()
                ]
                cursor.execute(
                    "SELECT name FROM public.django_migrations WHERE app='products' ORDER BY name"
                )
                product_migrations = [row[0] for row in cursor.fetchall()]
                cursor.execute(
                    "SELECT count(*) FROM pg_constraint WHERE contype IN ('f','c') AND NOT convalidated"
                )
                constraint_count = cursor.fetchone()
                if constraint_count is None:
                    raise RuntimeError("The constraint query returned no result.")
                unvalidated = constraint_count[0]
                if unvalidated:
                    raise RuntimeError("Restored database has unvalidated constraints.")
            report = {
                "dump": dump.name,
                "sha256": hashlib.sha256(dump.read_bytes()).hexdigest(),
                "restore": "passed",
                "local_host": "127.0.0.1",
                "local_port": port,
                "local_database": database,
                "counts": counts,
                "table_sha256": table_hashes,
                "product_migrations": product_migrations,
                "images": images,
                "omitted_platform_objects": omitted,
                "unvalidated_constraints": unvalidated,
            }
            (private_root / "restore-validation.json").write_text(
                json.dumps(report, indent=2), encoding="utf-8"
            )
            print(
                "PASS: restored all",
                len(tables),
                "application/framework tables; constraints validated.",
            )
            print(
                "Business counts:",
                json.dumps(
                    {
                        k: v
                        for k, v in counts.items()
                        if k.startswith(("core_", "products_", "orders_", "support_"))
                    }
                ),
            )
        finally:
            connection.close()
    finally:
        if started:
            run("pg_ctl", "-D", cluster, "-m", "fast", "-w", "stop")
            print(
                "Isolated local PostgreSQL stopped; original dump and restored files retained privately."
            )


if __name__ == "__main__":
    main()
