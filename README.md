# E-Commerce Soluções B2B

## Descrição
Projeto de portfólio de um e-commerce B2B. Uma organização atacadista (super usuário) gerencia o catálogo, o estoque e os pedidos, enquanto as organizações compradoras podem fazer compras, programar pedidos recorrentes e entrar em contato pelo suporte.

## Tecnologias Utilizadas

- **Frontend:** Next.js, React e Tailwind CSS, com renderização no servidor (SSR).
- **Backend:** Python, Django e Django REST Framework, com autenticação JWT pelo Simple JWT.
- **Banco de dados:** PostgreSQL, com SQLite como alternativa para desenvolvimento local.
- **Imagens:** arquivos locais no desenvolvimento e Cloudinary em produção.
- **Verificações de código:** Oxlint, Prettier, Ruff e Pyright.

## Rodando a Aplicação
Use Node.js 22 e Python 3.13. Os comandos abaixo são para PowerShell.

No backend:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env.local
```

Preencha uma chave própria em `DJANGO_SECRET_KEY`. Para usar o PostgreSQL, preencha `DATABASE_URL`, se deixar vazio, o projeto usa SQLite.

```powershell
python manage.py migrate
python manage.py loaddata demo
python manage.py runserver
```

Em outro terminal, na pasta do projeto:

```powershell
cd frontend
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Depois disso você vai conseguir acessar o projeto em: http://localhost:3000. As configurações ficam nos arquivos de ambiente.

## Testes

No frontend, execute `npm test`. No backend, execute `python manage.py test` com o ambiente virtual ativado.

## Link para Testar a Aplicação
[Projeto E-commerce B2B](https://ecommercesolucoesb2b.vercel.app)
