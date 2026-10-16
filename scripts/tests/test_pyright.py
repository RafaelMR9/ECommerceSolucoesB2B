import json
import subprocess
import sys
import tempfile
from pathlib import Path
from unittest import TestCase

ROOT = Path(__file__).resolve().parents[2]


class PyrightChecks(TestCase):
    def check_source(self, source):
        with tempfile.TemporaryDirectory() as directory:
            fixture = Path(directory) / "fixture.py"
            fixture.write_text(source, encoding="utf-8")
            result = subprocess.run(
                [
                    sys.executable,
                    "-m",
                    "pyright",
                    "--project",
                    str(ROOT / "pyrightconfig.json"),
                    "--outputjson",
                    str(fixture),
                ],
                cwd=ROOT,
                text=True,
                capture_output=True,
                timeout=60,
            )
        self.assertEqual(result.stderr, "")
        return result.returncode, json.loads(result.stdout)

    def test_valid_code_and_framework_imports_are_accepted(self):
        status, report = self.check_source(
            """
from rest_framework import serializers
from products.models import Product

def describe(name: str, quantity: int) -> str:
    return f"{name}: {quantity}"

field = serializers.CharField()
products = Product.objects.all()
description = describe("Demo", 2)
"""
        )
        self.assertEqual(status, 0)
        self.assertEqual(report["generalDiagnostics"], [])

    def test_type_errors_and_missing_imports_are_still_rejected(self):
        status, report = self.check_source(
            """
import nonexistent_pyright_test_module

def echo(value: str) -> str:
    return value

def invalid_return() -> int:
    return "one"

def optional_length(value: str | None) -> int:
    return len(value.upper())

echo(123)
print(undefined_value)
"""
        )
        self.assertEqual(status, 1)
        rules = {item["rule"] for item in report["generalDiagnostics"]}
        self.assertTrue(
            {
                "reportMissingImports",
                "reportArgumentType",
                "reportReturnType",
                "reportOptionalMemberAccess",
                "reportUndefinedVariable",
            }.issubset(rules),
            rules,
        )
