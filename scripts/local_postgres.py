import argparse
import os
import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CLUSTER = ROOT / "backend/backups/local-postgres"
PORT = "5433"


def executable(name):
    command = shutil.which(name)
    if not command and os.name == "nt":
        command = Path("C:/Program Files/PostgreSQL/16/bin") / f"{name}.exe"
        if not command.is_file():
            command = None
    if not command:
        raise SystemExit(f"Install PostgreSQL and add {name} to PATH.")
    return str(command)


def run(name, *arguments):
    subprocess.run(
        [executable(name), *map(str, arguments)],
        check=True,
        creationflags=subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0,
    )


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("action", choices=("start", "stop"))
    args = parser.parse_args()
    if args.action == "stop":
        run("pg_ctl", "-D", CLUSTER, "-m", "fast", "-w", "stop")
        return
    new_cluster = not (CLUSTER / "PG_VERSION").exists()
    if new_cluster:
        if CLUSTER.exists():
            raise SystemExit("Refusing to replace an existing directory.")
        CLUSTER.parent.mkdir(parents=True, exist_ok=True)
        run(
            "initdb",
            "-D",
            CLUSTER,
            "-U",
            "ecommerce_local",
            "--auth=trust",
            "--encoding=UTF8",
            "--no-locale",
        )
    status = subprocess.run(
        [executable("pg_ctl"), "-D", str(CLUSTER), "status"],
        check=False,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        creationflags=subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0,
    )
    if status.returncode:
        run(
            "pg_ctl",
            "-D",
            CLUSTER,
            "-l",
            CLUSTER.parent / "local-postgres.log",
            "-o",
            f"-h 127.0.0.1 -p {PORT}",
            "-w",
            "start",
        )
    if new_cluster:
        run(
            "createdb",
            "-h",
            "127.0.0.1",
            "-p",
            PORT,
            "-U",
            "ecommerce_local",
            "ecommerce_local",
        )
    print(f"Local PostgreSQL: 127.0.0.1:{PORT}/ecommerce_local")


if __name__ == "__main__":
    main()
