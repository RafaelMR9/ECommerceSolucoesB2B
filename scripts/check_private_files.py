"""Check Git's index for private files, including files already tracked before ignores."""
from pathlib import Path
import re
import subprocess
import sys

root = Path(__file__).resolve().parents[1]
paths = subprocess.check_output(['git', 'ls-files', '--cached'], cwd=root, text=True).splitlines()
unsafe = []
for name in paths:
    path = Path(name)
    if ((path.name.startswith('.env') and not path.name.endswith('.example'))
        or path.suffix in ('.sqlite3', '.dump', '.sql', '.pem', '.key')
        or name.startswith(('backups/', 'backend/media/'))):
        unsafe.append(name)
    if path.suffix == '.py':
        # Scan the actual index, since working-tree cleanup alone is insufficient.
        source = subprocess.check_output(['git', 'show', ':' + name], cwd=root, text=True)
        if re.search(r'^\s*(SECRET_KEY|DJANGO_SECRET_KEY|CLOUDINARY_API_SECRET)\s*=\s*[\'\"]', source, re.M):
            unsafe.append(name + ': literal secret in index')
if unsafe:
    print('Private content still present in Git index:\n' + '\n'.join(unsafe))
    sys.exit(1)
print('PASS: no private files or literal Django/Cloudinary secret found in Git index.')
