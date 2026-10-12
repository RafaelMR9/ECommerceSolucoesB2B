import ast
import subprocess
import sys
from pathlib import Path

SECRET_NAMES = {"SECRET_KEY", "DJANGO_SECRET_KEY", "CLOUDINARY_API_SECRET"}


def contains_literal_secret(source):
    for node in ast.walk(ast.parse(source)):
        if not isinstance(node, (ast.Assign, ast.AnnAssign)):
            continue
        if not isinstance(node.value, ast.Constant) or not isinstance(
            node.value.value, str
        ):
            continue
        targets = node.targets if isinstance(node, ast.Assign) else [node.target]
        if any(
            isinstance(target, ast.Name) and target.id in SECRET_NAMES
            for target in targets
        ):
            return True
    return False


def main():
    root = Path(__file__).resolve().parents[1]
    paths = subprocess.check_output(
        ["git", "ls-files", "--cached"], cwd=root, text=True
    ).splitlines()
    unsafe = []
    for name in paths:
        path = Path(name)
        if (
            (path.name.startswith(".env") and not path.name.endswith(".example"))
            or path.suffix in (".sqlite3", ".dump", ".sql", ".pem", ".key")
            or name.startswith(("backups/", "backend/media/"))
        ):
            unsafe.append(name)
        if path.suffix == ".py":
            source = subprocess.check_output(
                ["git", "show", ":" + name], cwd=root, text=True
            )
            try:
                if contains_literal_secret(source):
                    unsafe.append(name + ": literal secret assignment in index")
            except SyntaxError:
                unsafe.append(
                    name + ": invalid Python; unable to check secret assignments"
                )
    if unsafe:
        print("Private content still present in Git index:\n" + "\n".join(unsafe))
        return 1
    print(
        "PASS: no private files or literal Django/Cloudinary secret assignment found in Git index."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
