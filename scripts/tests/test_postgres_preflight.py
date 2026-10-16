import json
import tempfile
from pathlib import Path
from unittest import TestCase
from unittest.mock import patch

from scripts import validate_postgres_backup, verify_postgres_migrations


class PostgresPreflightTests(TestCase):
    def test_missing_binary_stops_before_starting_a_cluster(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            private = root / "backups/heroku-current"
            private.mkdir(parents=True)
            dump = private / "fixture.dump"
            dump.touch()
            with (
                patch.object(validate_postgres_backup, "ROOT", root),
                patch("sys.argv", ["validate_postgres_backup.py", str(dump)]),
                patch.object(
                    validate_postgres_backup.shutil, "which", return_value=None
                ),
                patch.object(validate_postgres_backup.subprocess, "run") as run,
            ):
                with self.assertRaisesRegex(SystemExit, "initdb.*PATH"):
                    validate_postgres_backup.main()
                run.assert_not_called()

    def test_missing_cloud_name_stops_before_creating_a_migration_clone(self):
        with tempfile.TemporaryDirectory() as directory:
            private = Path(directory)
            cluster = private / "validation-postgres"
            cluster.mkdir()
            (cluster / "PG_VERSION").write_text("16", encoding="utf-8")
            (private / "restore-validation.json").write_text(
                json.dumps({"local_database": "portfolio_restore_1234abcd"}),
                encoding="utf-8",
            )
            with (
                patch.object(verify_postgres_migrations, "PRIVATE", private),
                patch.object(verify_postgres_migrations, "CLUSTER", cluster),
                patch.object(
                    verify_postgres_migrations.shutil, "which", return_value="fixture"
                ),
                patch.object(
                    verify_postgres_migrations,
                    "dotenv_values",
                    return_value={"CLOUDINARY_CLOUD_NAME": None},
                ),
                patch.object(verify_postgres_migrations.subprocess, "run") as run,
            ):
                with self.assertRaisesRegex(SystemExit, "CLOUDINARY_CLOUD_NAME"):
                    verify_postgres_migrations.main()
                run.assert_not_called()
