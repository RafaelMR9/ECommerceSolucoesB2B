# E-Commerce Soluções B2B

## Descrição
Aplicação Web Full Stack Responsiva de E-Commerce B2B (Business-to-Business), ideal para organizações que precisam adquirir produtos em grandes quantidades. Destinada a hospitais, escolas, hotéis, restaurantes e outras organizações, a plataforma facilita a compra em volume a preços competitivos. Diferente de um marketplace comum, aqui uma única organização atacadista centraliza as vendas, otimizando a gestão de estoque e pedidos e integrando sistemas de faturamento.

## Tecnologias Utilizadas

### Frontend
- **Next.js**: Uma framework React. No projeto, foi usada para construir uma interface de usuário interativa e eficiente.
- **Tailwind CSS**: Um framework de CSS para design utilitário. Foi empregado para estilizar os componentes da interface do usuário, com um layout responsivo e personalizável.

### Backend
- **Django**: Um framework de alto nível para Python. No projeto, foi utilizado para estruturar a lógica do servidor, gerenciar o banco de dados, e fornecer uma base sólida e segura para o backend.
- **Django Rest Framework**: Uma ferramenta poderosa e flexível para construir APIs web. Complementando o Django, foi utilizada para criar interfaces API RESTful, facilitando a serialização de dados e a comunicação entre o frontend e o backend.

### Banco de Dados
- **SQLite**: Um banco de dados SQL embutido que é leve e independente, ideal para desenvolvimento e testes. No projeto, foi usado para armazenar dados de forma local.

## Versão unificada

Este repositório reúne a aplicação local e as adaptações das cópias `ECommerceClient` e `ECommerceServer`. A [comparação e preservação dos dados](docs/COMPARACAO.md) registra as diferenças; a [avaliação de migração para Vercel e Neon](docs/MIGRACAO.md) descreve os próximos passos. O deploy e as configurações dos serviços atuais permanecem inalterados.

O [estado atual da produção](docs/PRESERVACAO_PRODUCAO.md) também foi preservado: dump restaurado e conferido contra as 26 tabelas ativas, 13 imagens Cloudinary, configurações privadas e artefato do deploy. As migrações da base unificada foram validadas sobre uma cópia desse PostgreSQL.

| Configuração | Desenvolvimento | Hospedagem |
| --- | --- | --- |
| Django | `DJANGO_ENV=development` | `DJANGO_ENV=production` |
| Banco | SQLite existente ou PostgreSQL opcional | PostgreSQL via `DATABASE_URL` |
| Imagens novas | `MEDIA_STORAGE=local` em `backend/media` | `MEDIA_STORAGE=cloudinary` |
| URL da API no servidor Next.js | `API_URL=http://127.0.0.1:8000/api/` | `API_URL=https://HOST/api/` |
| Recuperação de senha | E-mail no console por padrão | SMTP e `FRONTEND_URL` configurados |

O backend entrega URLs completas das imagens em ambos os ambientes. Referências Cloudinary antigas também são aceitas; para exibi-las localmente, configure o nome público da conta em `CLOUDINARY_CLOUD_NAME`. As chaves privadas de upload só são necessárias quando se usa o armazenamento Cloudinary.

## Rodando localmente no Windows

A base de compatibilidade original foi validada com Python 3.11. Use dois terminais a partir da raiz do repositório.

Backend:

```powershell
py -3.11 -m venv backend/.venv
backend/.venv/Scripts/python.exe -m pip install -r backend/requirements.txt
# Em um clone novo, copie o exemplo. Não sobrescreva um .env existente.
if (-not (Test-Path backend/.env)) { Copy-Item backend/.env.example backend/.env }
# Edite backend/.env: defina uma chave aleatória própria e mantenha development/local.
backend/.venv/Scripts/python.exe backend/manage.py migrate
backend/.venv/Scripts/python.exe backend/manage.py runserver
```

Frontend:

```powershell
cd frontend
npm ci
if (-not (Test-Path .env.local)) { Copy-Item .env.example .env.local }
npm run dev
```

Abra `http://localhost:3000`. O `.env` local já preparado nesta máquina mantém a chave original fora do código; não é necessário sobrescrevê-lo. O banco e as imagens existentes permanecem no disco. Bancos, imagens de usuários e backups privados não são distribuídos em clones novos do Git; para um ambiente vazio, rode as migrações e `createsuperuser`, ou restaure uma cópia privada. `ADMIN_EMAIL` configura o e-mail do administrador criado pelo comando.

No backend, variáveis do processo têm prioridade sobre `backend/.env.local` e `backend/.env`. Caminhos são resolvidos a partir do backend, independentemente do diretório de execução. `SQLITE_PATH` permite trabalhar com uma cópia sem substituir `backend/db.sqlite3`.

Para habilitar a apresentação de portfólio no login, defina `NEXT_PUBLIC_DEMO_MODE=true`; usuário e senha intencionalmente públicos podem ser definidos em `NEXT_PUBLIC_DEMO_USERNAME` e `NEXT_PUBLIC_DEMO_PASSWORD`. Isso apenas exibe a apresentação: não cria usuários nem agenda resets. Nunca use credenciais de serviços nessas variáveis.

## Verificação e publicação de segredos

```powershell
backend/.venv/Scripts/python.exe backend/manage.py check
backend/.venv/Scripts/python.exe backend/manage.py makemigrations --check --dry-run
cd backend
.venv/Scripts/python.exe manage.py test --noinput
.venv/Scripts/python.exe -m ruff check .
.venv/Scripts/python.exe -m ruff format --check .
cd ..
# Disponível nesta máquina, com as cópias preservadas dos bancos:
backend/.venv/Scripts/python.exe scripts/verify_preservation.py
backend/.venv/Scripts/python.exe scripts/check_private_files.py
```

Para compilar o frontend, defina `API_URL` em `.env.local` ou no ambiente do build e execute `npm run build` em `frontend`. `NEXT_PUBLIC_API_URL` continua aceito para compatibilidade. A [documentação da interface](docs/INTERFACE.md) descreve a identidade visual, os componentes, SSR e as correções de fluxo.

A [documentação do backend](docs/BACKEND.md) descreve a organização, as permissões, as validações e os fluxos transacionais. Para instalar as ferramentas de desenvolvimento, use `backend/requirements-dev.txt`; a instalação de produção continua usando `backend/requirements.txt`.

`.env`, bancos, dumps, backups, uploads locais e bytecode ficam fora do Git. O verificador de arquivos privados examina o índice Git, incluindo o conteúdo realmente preparado para commit; rode novamente depois de preparar todas as alterações. A chave antiga e arquivos privados já existentes no histórico não são removidos retroativamente: rotacione qualquer chave real previamente publicada. Guarde os snapshots e bundles em armazenamento privado.

## Hospedagem e migração

`backend/.env.production.example` contém somente exemplos, sem credenciais reais. Use o painel do provedor para os valores privados. `DJANGO_ALLOWED_HOSTS` recebe nomes de host sem `https://`; CORS e CSRF recebem origens completas. O Next.js utiliza SSR e API routes: configure a URL no ambiente do servidor e use um runtime Next.js. Publique frontend e backend desta revisão juntos; o carrinho e os pedidos utilizam novos endpoints.

O `Procfile` mantém a opção Gunicorn e `backend/vercel.json` prepara a descoberta Django pela Vercel. Antes de usar o runtime atual da Vercel, atualize e valide a base Python/Django conforme [MIGRACAO.md](docs/MIGRACAO.md): o baseline antigo não foi homologado para o Python 3.12+ da plataforma. Nenhum serviço deve ser encerrado até validar um backup novo da produção, dados reconciliados, imagens e os fluxos publicados no novo ambiente.

## Link para Testar a Aplicação
[Projeto E-commerce B2B](https://ecommercesolucoesb2b.vercel.app)
<br>

![image](https://github.com/RafaelMR9/ECommerceSolucoesB2B/assets/24281310/cac534dc-d119-42ba-9a5a-631158c6251c)
<br>

![image](https://github.com/RafaelMR9/ECommerceSolucoesB2B/assets/24281310/9e5043c3-539b-434e-8f3b-a5fe21352b66)
