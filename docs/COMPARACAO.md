# Comparação e preservação — 11/10/2026

**Atualização:** a produção atual da Heroku foi posteriormente preservada e validada. Consulte [PRESERVACAO_PRODUCAO.md](PRESERVACAO_PRODUCAO.md) para o dump b051, imagens, código efetivamente publicado e comparação com os bancos locais. Os dados abaixo documentam a comparação inicial das cópias fornecidas.

## Resultado

`ECommerceSolucoesB2B` é a base unificada. Todos os serviços, rotas, modelos de negócio e páginas presentes nas outras duas cópias já existiam nela. As diferenças de código se concentram na configuração de hospedagem, armazenamento de imagens e apresentação da demonstração.

Comparação feita nos arquivos locais dos três repositórios, antes das alterações. Não comprova que os diretórios publicados correspondem ao último deploy remoto: isso exige conferir os deploys e o banco atual nas contas.

## Diferenças de código

| Parte | Diferença original | Tratamento na base unificada |
| --- | --- | --- |
| Frontend/configuração | URL localhost versus Heroku fixa | `NEXT_PUBLIC_API_URL`, normalizada com barra final |
| Home e páginas de produto | Frontend publicado prefixava Cloudinary em cinco pontos | API devolve URL completa em ambos os ambientes; páginas locais já usam essa URL |
| Login | Publicado mostrava credenciais de demonstração e alegava resets periódicos | Apresentação controlada por `NEXT_PUBLIC_DEMO_MODE`; credenciais públicas opcionais por ambiente; removida promessa de reset sem rotina correspondente |
| Produto/backend | `ImageField` local versus `CloudinaryField` publicado | `ImageField(max_length=255)` com storage configurável; leitura de referências Cloudinary antigas |
| Migrações | Servidor tinha `0002_alter_product_image` | Copiada sem alterações; nova `0003` unifica o campo sem reescrever referências |
| Banco e serviços | Servidor usava `django_heroku`, Cloudinary e configurações próprias | Configuração explícita por ambiente, PostgreSQL por `DATABASE_URL`, sem `django_heroku` |
| Estáticos | Configuração incompleta para hospedagem | `STATIC_ROOT` e WhiteNoise; Vercel pode coletar e servir pelo CDN |
| Dependências | Pipfiles locais e publicados diferentes; requirements publicado em UTF-16 | `backend/requirements.txt` UTF-8 como fonte única; Pipfiles originais preservados nos snapshots |
| E-mail | Recuperação de senha apontava para localhost nas três versões | `FRONTEND_URL`; console no desenvolvimento, SMTP configurável na hospedagem |

Os demais arquivos versionados do frontend, inclusive dependências e assets públicos, eram iguais. Os modelos, serializers, views, validators e rotas das sete áreas de negócio eram iguais, exceto o campo de imagem do produto. A diferença em `wsgi.py` era de espaçamento.

Funcionalidades mantidas: login/JWT/refresh, cadastro e perfil, recuperação de senha, categorias, produtos, promoções, fornecedores, transportadoras, carrinho, compra, pedidos de venda e fornecedor (recorrentes e avulsos), pagamentos/faturamento, reposição, análise e tickets de suporte.

## Dados encontrados

| Dados | SQLite local | SQLite do diretório servidor |
| --- | ---: | ---: |
| Usuários | 2 | 4 |
| Produtos | 13 | 14 |
| Categorias | 12 | 12 |
| Fornecedores | 3 | 3 |
| Transportadoras | 3 | 3 |
| Promoções | 1 | 1 |
| Pedidos de venda / itens | 1 / 1 | 1 / 1 |
| Pedidos de fornecedor / itens | 1 / 1 | 0 / 0 |
| Notas de venda / itens | 2 / 2 | 2 / 2 |
| Tickets | 3 | 3 |
| Remessas | 1 | 1 |
| Migrações aplicadas | 43 | 44 |

Ambos passaram em `PRAGMA integrity_check`. Os dois diretórios `media` possuem os mesmos 14 arquivos, totalizando 493.575 bytes. Todas as referências locais dos produtos têm arquivo correspondente. O SQLite do servidor contém também uma referência Cloudinary.

Existem conflitos, não apenas registros adicionais: o usuário de ID 1 e os 13 produtos compartilhados têm valores diferentes entre os bancos. O servidor tem os usuários de IDs 2 e 3 e o produto de ID 15 adicionais; o local tem o pedido de fornecedor de ID 26 e seu item de ID 25. Uma união por ID ou uma restauração por cima do outro banco perderia versões de dados. Nenhum dos bancos foi sobrescrito ou mesclado automaticamente.

O arquivo `ECommerceClient/ecommercebackup.dump` é um dump custom PostgreSQL criado em **23/12/2023**, a partir do PostgreSQL 15.5. Seu catálogo foi lido com `pg_restore`; os 13 produtos do dump usam referências Cloudinary. Não é um backup atual e ainda não foi restaurado integralmente para validar o restante dos dados.

## Preservação privada

Snapshots independentes em `../_preservation/2026-10-11-before-unification/`:

- ZIP de cada diretório com código, bancos e imagens; conteúdo conferido por SHA-256.
- Bundle Git de cada repositório com todas as refs locais disponíveis.
- `manifest.json` com commits de origem e hashes dos arquivos.

Cópias de trabalho dos três bancos também estão em `backups/source-databases/`, dentro da base unificada, com manifest de hashes. `backups/`, bancos e `backend/media/` são ignorados pelo Git. Essas cópias devem ser guardadas em armazenamento privado se você transferir o projeto para outra máquina.

Os bancos e as imagens originais permanecem no disco. Foram retirados do índice Git, juntamente com bytecode Python. A chave Django local fixa foi movida para `backend/.env` ignorado. Como a chave e bancos já existiam no histórico Git, essa limpeza não remove publicações passadas: use uma **nova chave de produção**, e qualquer credencial real anteriormente versionada precisa ser rotacionada. Os bundles privados também contêm esse histórico e não devem ser publicados.

O código antigo de `ECommerceServer/api/settings.py` também continha a API key e o API secret do Cloudinary como valores fixos versionados. Esses valores foram preservados em `ECommerceServer/.env` ignorado e substituídos por leitura de ambiente nessa cópia local; a configuração agora carrega o `.env` antes de configurar Cloudinary. Essa limpeza pontual evita incluí-los em novos commits daquele código, mas não altera os deploys existentes nem remove o histórico anterior. **Rotacionar o segredo Cloudinary é necessário antes de reutilizar a conta na nova publicação.** Nenhum valor foi copiado para arquivos públicos da base unificada.

## Verificação realizada

- `manage.py check` e `makemigrations --check --dry-run` passaram.
- 10 testes passaram: login/refresh, e-mail com URL configurada, leitura de imagens antigas, validação de imagem e criação/edição/exclusão lógica de produtos com armazenamento local e Cloudinary simulado e transferência de imagens com manifest de rollback.
- Migrações executadas em cópias temporárias de ambos os SQLite: todos os registros das tabelas de negócio preservados, inclusive hashes de senha e referências de imagem; integridade e chaves estrangeiras verificadas; hashes dos bancos originais inalterados.
- Configuração de produção validada sem conexão externa: SSL/pooling e rejeição de banco ausente, imagem local, DEBUG ligado e chaves ausentes.
- `collectstatic` passou.
- `npm run build` passou e gerou 43 páginas estáticas, com avisos preexistentes de hooks e uso de `<img>`.
- Plano de transferência de imagens identificou 13 imagens locais, em dry run, sem upload ou alteração de referências.
- Verificação do índice Git passou para arquivos privados e chaves literais Django/Cloudinary.

Isso verifica a integração alterada, não equivale a testar manualmente todos os fluxos de negócio ou validar os serviços remotos. Nenhum deploy, push, alteração de configuração remota ou encerramento de serviço foi realizado.
