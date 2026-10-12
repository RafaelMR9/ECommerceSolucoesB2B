import hashlib
import os
import shutil
import sqlite3
import subprocess
import sys
import tempfile
from contextlib import closing
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def rows(path):
    with closing(sqlite3.connect(path.as_uri() + "?mode=ro", uri=True)) as connection:
        tables = [
            r[0]
            for r in connection.execute(
                "SELECT name FROM sqlite_master WHERE type='table' AND name != 'django_migrations' AND name NOT LIKE 'sqlite_%'"
            )
        ]
        result = {}
        for table in tables:
            cursor = connection.execute(f'SELECT * FROM "{table}"')
            columns = [column[0] for column in cursor.description]
            result[table] = sorted(
                [dict(zip(columns, row)) for row in cursor],
                key=lambda row: repr(sorted(row.items())),
            )
        return result


def main():
    server = ROOT / "backups/source-databases/server.sqlite3"
    if not server.exists():
        server = ROOT.parent / "ECommerceServer/db.sqlite3"
    sources = [ROOT / "backend/db.sqlite3", server]
    for source in sources:
        original_hash = hashlib.sha256(source.read_bytes()).hexdigest()
        expected = rows(source)
        with tempfile.TemporaryDirectory() as directory:
            copy = Path(directory) / "test.sqlite3"
            shutil.copy2(source, copy)
            env = dict(
                os.environ,
                DJANGO_ENV="development",
                DJANGO_DEBUG="true",
                MEDIA_STORAGE="local",
                DATABASE_URL="",
                SQLITE_PATH=str(copy),
            )
            subprocess.run(
                [
                    sys.executable,
                    str(ROOT / "backend/manage.py"),
                    "migrate",
                    "--noinput",
                ],
                env=env,
                check=True,
            )
            actual = rows(copy)
            for table in expected:
                if table.startswith(
                    (
                        "core_",
                        "products_",
                        "orders_",
                        "suppliers_",
                        "carriers_",
                        "marketing_",
                        "support_",
                    )
                ):
                    if actual[table] != expected[table]:
                        raise RuntimeError(
                            f"Changed application data in {source.name}: {table}"
                        )
            with closing(sqlite3.connect(copy)) as connection:
                assert (
                    connection.execute("PRAGMA integrity_check").fetchone()[0] == "ok"
                )
                assert not connection.execute("PRAGMA foreign_key_check").fetchall()
        assert hashlib.sha256(source.read_bytes()).hexdigest() == original_hash
        print(
            f"PASS: {source.parent.name}; all application rows preserved; original hash unchanged"
        )


if __name__ == "__main__":
    main()
