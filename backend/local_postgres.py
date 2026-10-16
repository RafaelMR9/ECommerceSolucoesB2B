import argparse
import os
import shutil
import subprocess
from pathlib import Path

CLUSTER = Path(__file__).resolve().parent / "backups/local-postgres"


def main():
    parser = argparse.ArgumentParser(description="Controle do PostgreSQL local.")
    parser.add_argument("action", choices=("start", "stop"))
    action = parser.parse_args().action

    pg_ctl = shutil.which("pg_ctl")
    if not pg_ctl and os.name == "nt":
        installed = Path("C:/Program Files/PostgreSQL/16/bin/pg_ctl.exe")
        if installed.is_file():
            pg_ctl = str(installed)
    if not pg_ctl:
        raise SystemExit("Instale o PostgreSQL e adicione pg_ctl ao PATH.")
    if not (CLUSTER / "PG_VERSION").is_file():
        raise SystemExit("O banco PostgreSQL local ainda não foi configurado.")

    command = [pg_ctl, "-D", str(CLUSTER)]
    creationflags = subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0
    if action == "start":
        status = subprocess.run(
            [*command, "status"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            check=False,
            creationflags=creationflags,
        )
        if status.returncode == 0:
            print("O PostgreSQL local já está em execução.")
            return
        command.extend(
            [
                "-l",
                str(CLUSTER.parent / "local-postgres.log"),
                "-o",
                "-h 127.0.0.1 -p 5433",
            ]
        )
    else:
        command.extend(["-m", "fast"])
    subprocess.run([*command, "-w", action], check=True, creationflags=creationflags)


if __name__ == "__main__":
    main()
