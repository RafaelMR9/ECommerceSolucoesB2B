import hashlib
import json
import os
import re
import shutil
import socket
import subprocess
import sys
import uuid
from contextlib import closing
from pathlib import Path

import psycopg2
from dotenv import dotenv_values
from psycopg2 import sql

ROOT = Path(__file__).resolve().parents[1]
PRIVATE = ROOT / "backups/heroku-current"
CLUSTER = PRIVATE / "validation-postgres"
PREFIXES = (
    "core_",
    "products_",
    "orders_",
    "suppliers_",
    "carriers_",
    "marketing_",
    "support_",
)


def rows(connection):
    result = {}
    with connection.cursor() as cursor:
        cursor.execute("SET TIME ZONE 'UTC'")
        cursor.execute(
            "SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename"
        )
        for table in [
            row[0] for row in cursor.fetchall() if row[0].startswith(PREFIXES)
        ]:
            cursor.execute(
                sql.SQL("SELECT * FROM public.{}").format(sql.Identifier(table))
            )
            columns = [column.name for column in cursor.description]
            records = [dict(zip(columns, row)) for row in cursor.fetchall()]
            records.sort(key=lambda row: json.dumps(row, default=str, sort_keys=True))
            result[table] = records
    return result


def main():
    validation = json.loads(
        (PRIVATE / "restore-validation.json").read_text(encoding="utf-8")
    )
    source = validation["local_database"]
    if (
        not re.fullmatch(r"portfolio_restore_[a-f0-9]{8}", source)
        or not (CLUSTER / "PG_VERSION").is_file()
    ):
        raise SystemExit("Expected isolated validation cluster/database not found.")
    clone = "portfolio_migration_" + uuid.uuid4().hex[:8]
    with socket.socket() as probe:
        probe.bind(("127.0.0.1", 0))
        port = probe.getsockname()[1]
    env = {key: value for key, value in os.environ.items() if not key.startswith("PG")}
    flags = subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0

    def pg_ctl(*arguments):
        with (PRIVATE / "migration-pg_ctl.log").open("ab") as output:
            subprocess.run(
                [shutil.which("pg_ctl"), "-D", str(CLUSTER), *arguments],
                env=env,
                stdout=output,
                stderr=output,
                check=True,
                creationflags=flags,
            )

    started = False
    try:
        pg_ctl(
            "-l",
            str(PRIVATE / "migration-postgres.log"),
            "-o",
            f"-h 127.0.0.1 -p {port}",
            "-w",
            "start",
        )
        started = True
        subprocess.run(
            [
                shutil.which("createdb"),
                "-h",
                "127.0.0.1",
                "-p",
                str(port),
                "-U",
                "portfolio_validation",
                "--template",
                source,
                clone,
            ],
            env=env,
            check=True,
            creationflags=flags,
        )
        connect = dict(
            host="127.0.0.1", port=port, user="portfolio_validation", dbname=clone
        )
        with closing(psycopg2.connect(**connect)) as connection:
            before = rows(connection)
        cloud = dotenv_values(ROOT.parent / "ECommerceServer/.env", encoding="utf-8")
        child_env = dict(
            env,
            DJANGO_ENV="development",
            DJANGO_DEBUG="true",
            DJANGO_ALLOWED_HOSTS="localhost,127.0.0.1,testserver",
            DATABASE_URL=f"postgresql://portfolio_validation@127.0.0.1:{port}/{clone}?sslmode=disable",
            MEDIA_STORAGE="cloudinary",
            CLOUDINARY_CLOUD_NAME=cloud["CLOUDINARY_CLOUD_NAME"],
            CLOUDINARY_API_KEY="not-used-read-only-validation",
            CLOUDINARY_API_SECRET="not-used-read-only-validation",
        )
        subprocess.run(
            [sys.executable, str(ROOT / "backend/manage.py"), "migrate", "--noinput"],
            env=child_env,
            check=True,
            creationflags=flags,
        )
        subprocess.run(
            [sys.executable, str(ROOT / "backend/manage.py"), "check"],
            env=child_env,
            check=True,
            creationflags=flags,
        )
        smoke = """import django, json, os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api.settings')
django.setup()
from rest_framework.test import APIClient
from core.models import User
from products.models import Product
from api.media import cloudinary_url
client = APIClient()
administrator = User.objects.filter(is_superuser=True).first()
assert administrator is not None, 'Validation clone requires an administrator'
client.force_authenticate(administrator)
for product in Product.objects.all():
    response = client.get(f'/api/products/{product.pk}/detail/')
    assert response.status_code == 200
    assert response.data['image'] == cloudinary_url(product.image.name)
print('PASS: product detail API and full Cloudinary URLs for', Product.objects.count(), 'products')
"""
        subprocess.run(
            [sys.executable, "-c", smoke],
            cwd=ROOT / "backend",
            env=child_env,
            check=True,
            creationflags=flags,
        )
        with closing(psycopg2.connect(**connect)) as connection:
            after = rows(connection)
        if before != after:
            raise RuntimeError("Business data changed in migration clone.")
        report = {
            "passed": True,
            "source_database": source,
            "clone_database": clone,
            "application_tables_preserved": len(before),
            "counts": {name: len(records) for name, records in after.items()},
            "business_rows_sha256": hashlib.sha256(
                json.dumps(after, default=str, sort_keys=True).encode("utf-8")
            ).hexdigest(),
        }
        (PRIVATE / "postgres-migration-validation.json").write_text(
            json.dumps(report, indent=2), encoding="utf-8"
        )
        print(
            "PASS: unified Django migrations and image serialization; all business rows unchanged."
        )
    finally:
        if started:
            pg_ctl("-m", "fast", "-w", "stop")
            print(
                "Isolated PostgreSQL stopped. Production and restored source were not modified."
            )


if __name__ == "__main__":
    main()
