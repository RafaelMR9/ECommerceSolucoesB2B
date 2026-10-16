#!/usr/bin/env python

import os
import sys


def main():
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "api.settings")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Não foi possível importar o Django. Ative o ambiente virtual "
            "e instale as dependências do backend."
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
