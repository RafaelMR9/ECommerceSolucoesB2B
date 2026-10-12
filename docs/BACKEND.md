# Backend

Cada aplicação mantém seus modelos, serializers, views e rotas. Os serializers validam os dados antes de salvar; as views cuidam de permissões, consultas e respostas. Não há uma camada genérica de serviços ou repositórios.

`core/permissions.py` contém a permissão administrativa usada pela interface (`is_superuser`) e a seleção de conta para consultas. `core/validators.py` reúne as validações de CPF, CNPJ e senha. E-mail e unicidade usam as verificações nativas dos campos do Django REST Framework.

## Acesso e validação

- A API exige autenticação por padrão. Cadastro, login, renovação de JWT e recuperação de senha permanecem públicos.
- Compradores consultam e editam seu próprio perfil e acessam somente seus pedidos e atendimentos. Enviar outro identificador de conta não amplia esse acesso.
- Cadastros administrativos, fornecedores, transportadoras, aprovação de crédito e processamento de pedidos exigem `is_superuser`. A API não permite atribuir privilégios no cadastro nem desbloquear compras pelo perfil.
- Assuntos de tickets aceitam texto simples ou o prefixo de nome utilizado pelo frontend. O remetente vem da sessão e o destinatário de uma resposta vem da conversa original.
- Preços devem ser finitos e não negativos; estoque não pode ser negativo e embalagens devem conter pelo menos uma unidade. Imagens devem ser válidas e ter até 4 MiB.
- Categorias não podem formar ciclos. A exclusão verifica produtos em todos os descendentes, incluindo produtos ocultos.
- Exclusões de contas, fornecedores e transportadoras com histórico associado são bloqueadas para evitar perda de pedidos, atendimentos e entregas por cascata.
- A recuperação de senha valida o token e sua expiração, salva apenas o hash e invalida os tokens da conta após a troca. A solicitação de e-mail retorna a mesma mensagem para contas existentes e inexistentes.

## Pedidos

`orders/checkout.py` concentra adição e remoção de itens, reserva e devolução de estoque, cálculo de preços e criação de notas. `orders/actions.py` processa cancelamento, preparação, envio, recebimento e pagamento. As operações permanecem em transações; uma falha também desfaz as gravações relacionadas.

Os endpoints antigos que gravavam diretamente pedidos, itens, notas ou entregas permitiam contornar essas operações. Eles retornam `405` para administradores e não devem mais ser usados. O frontend atual utiliza `orders/cart/add/`, `orders/cart/items/<id>/delete/`, `orders/checkout/` e as rotas de ação dos pedidos. As rotas de leitura foram preservadas. Publique frontend e backend juntos.

Uma promoção inexistente retorna JSON `null`; registros antigos com promoções simultâneas usam a primeira por identificador, assim como o catálogo e o carrinho. Novas promoções não podem se sobrepor.

## Desenvolvimento e verificações

Execute os comandos a partir de `backend`, com o ambiente local configurado:

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements-dev.txt
.\.venv\Scripts\python.exe -m ruff check .
.\.venv\Scripts\python.exe -m ruff format --check .
.\.venv\Scripts\python.exe manage.py check
.\.venv\Scripts\python.exe manage.py makemigrations --check --dry-run
.\.venv\Scripts\python.exe manage.py test --noinput
```

O Ruff verifica erros de Python, imports e formatação; migrações históricas e o ambiente virtual ficam fora da formatação. É uma dependência de desenvolvimento e não faz parte da instalação de produção.

Os testes do Django criam seu próprio banco temporário. A integração em `frontend/scripts/verify-ui.mjs` exige os usuários de teste e uma cópia local do banco: ela faz compras, cancelamentos e edições. Não a execute sobre o banco original. Ela autentica tanto as chamadas diretas ao Django quanto as chamadas por sessão do Next.js.

## Preservação

Esta revisão não altera campos, nomes de tabelas, migrações históricas nem registros existentes. Foram mantidos os nomes legados dos campos e os tipos de preço para evitar uma mudança de schema nesta etapa. A formatação dos modelos não exige migração. As restrições de unicidade existentes nos modelos também foram mantidas; uma revisão delas deve ser acompanhada de migração e avaliação dos dados.

As imagens locais e referências Cloudinary continuam usando `api/media.py`. O comando de promoção de imagens mantém o modo de simulação por padrão; seus testes usam um upload simulado. Nenhum upload real, alteração de serviço hospedado ou migração de banco de produção faz parte desta refatoração.

Referências: [serializers](https://www.django-rest-framework.org/api-guide/serializers/), [permissões](https://www.django-rest-framework.org/api-guide/permissions/), [validação](https://www.django-rest-framework.org/api-guide/validators/) e [transações](https://docs.djangoproject.com/en/4.2/topics/db/transactions/).
