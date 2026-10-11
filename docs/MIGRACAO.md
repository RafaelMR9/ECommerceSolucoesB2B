# Avaliação Vercel + Neon — 11/10/2026

**Atualização de preservação:** sessão Heroku confirmada; backup atual b051 capturado, baixado, restaurado e comparado por hash com as 26 tabelas ativas. As 13 imagens referenciadas, suas versões/metadados e o artefato do deploy foram preservados. As migrações do Django unificado passaram em uma cópia do PostgreSQL. Detalhes em [PRESERVACAO_PRODUCAO.md](PRESERVACAO_PRODUCAO.md). As etapas de preservação já estão concluídas; os passos restantes de deploy, reconciliação e encerramento continuam pendentes.

## Viabilidade e custo

A migração é viável em princípio para esta demonstração pessoal. Django pode continuar sendo Django: a [Vercel detecta `manage.py`, o entrypoint WSGI e os arquivos estáticos](https://vercel.com/docs/frameworks/full-stack/django). Um repositório pode alimentar dois projetos Vercel, com raízes `frontend` e `backend`. Esse arranjo permite validar e trocar a API sem alterar simultaneamente o frontend atual.

O [Hobby da Vercel](https://vercel.com/docs/plans/hobby) é gratuito para uso pessoal e não comercial, sujeito às quotas. O [anúncio oficial mais recente do Neon](https://neon.com/blog/neon-free-plan-1-gb-per-project), de 02/10/2026, informa 1 GB de PostgreSQL e 100 CU-horas por projeto/mês no plano Free, com 6 horas de restauração instantânea. Algumas páginas anteriores ainda citam 0,5 GB; confirme as quotas exibidas na conta no momento da criação. O volume dos bancos locais é pequeno, mas o tamanho e consumo da produção atual ainda precisam ser medidos.

O objetivo de eliminar os US$12/mês é possível se Vercel, Neon e o Cloudinary existente ficarem nos planos gratuitos e suas quotas. A economia só começa após encerrar os recursos pagos da Heroku; desligar apenas um dyno pode deixar o PostgreSQL ou outros add-ons cobrando. Nenhum recurso foi encerrado nesta etapa.

## Condições antes do deploy

1. **Atualizar a base de dependências em uma etapa própria.** A unificação foi testada com o baseline original Django 4.2.5 e Python 3.11. A [Vercel disponibiliza Python 3.12, 3.13 e 3.14](https://vercel.com/docs/functions/runtimes/python); o Python 3.11 original não é um alvo atual. [Django 4.2 encerrou suporte em abril de 2026](https://www.djangoproject.com/download/). Recomenda-se testar a migração para Django 5.2 LTS com Python 3.12, atualizando DRF/JWT/Pillow e demais dependências em conjunto, e conferir também o Next.js 13.2.1 original. O `vercel.json` incluído é uma preparação, não uma comprovação de compatibilidade do baseline antigo com o runtime atual.
2. **Backup novo da Heroku — concluído.** O dump atual b051 foi preservado e restaurado. As 26 tabelas corresponderam por hash ao banco ativo consultado em modo somente leitura. Antes de uma futura troca de ambiente ou encerramento, capturar novamente se a demonstração tiver recebido novas gravações.
3. **Imagens referenciadas no Cloudinary — concluído.** As 13 imagens usadas no banco atual e seus metadados foram preservados, com versões e hashes. Isso cobre os assets da demonstração referenciados no banco, sem modificar a conta Cloudinary.
4. **Reconciliar os conjuntos de dados em uma cópia.** Preservar os registros exclusivos e registrar explicitamente quais valores usar nos IDs conflitantes. Não importar fixtures por cima da produção ou escolher o banco mais recente apenas pelo número de registros. Guardar os três snapshots mesmo após definir o conjunto para a demonstração.
5. **Validar o PostgreSQL restaurado.** Testes com SQLite não validam todos os detalhes do PostgreSQL nem o banco remoto. Conferir contagens por tabela, relações, sequências de IDs, usuários, pedidos, faturamento e URLs de imagens após a restauração.

## Sequência de migração

1. Capturar um novo dump PostgreSQL e baixar uma cópia privada. Manter Heroku, Vercel atual e Cloudinary existentes funcionando.
2. Criar um projeto Neon Free e um banco vazio de homologação. Restaurar o dump novo com `pg_restore --no-owner --no-acl --exit-on-error`, usando a conexão **direta** e SSL; revisar previamente extensões exclusivas da Heroku. Não usar `--clean` contra um banco que já contenha dados. Se houver conflito, recomeçar em um novo banco vazio.
3. Comparar dados restaurados com o backup de origem. Fazer a reconciliação com os dados locais numa cópia separada, mantendo um relatório de escolhas e remapeamento de IDs/relacionamentos quando necessário.
4. Com a base modernizada, configurar Django por ambiente e executar `migrate` uma vez como operação explícita contra a cópia de homologação. Não executar migrações em cada request ou em builds de preview que apontem para o banco de produção.
5. Cloudinary continua hospedando os assets. A migração `products.0003` preserva suas referências antigas e o frontend recebe URLs completas. Quando a base escolhida contiver arquivos locais, executar primeiro `promote_local_images` sem `--apply`; após backup, usar `--apply` na cópia de migração. O comando mantém os arquivos locais e grava um manifest privado de referências antigas/novas para rollback. Referências sem arquivo local correspondente exigem revisão antes do upload.
6. Criar projeto Vercel para Django com Root Directory `backend`; definir as variáveis do `.env.production.example` no painel. Usar a URL **pooled** do Neon para as funções, `DB_CONN_MAX_AGE=0`, SSL e sem cursores server-side. Os hosts em `DJANGO_ALLOWED_HOSTS` não levam esquema; CORS e CSRF levam a origem completa. O frontend usado para testes precisa estar listado explicitamente.
7. Criar um preview do frontend a partir de `frontend`, com `NEXT_PUBLIC_API_URL=https://NOVA-API/api/`. Essa variável é pública e definida no build. Nunca colocar chaves Django, Cloudinary, banco ou SMTP em `NEXT_PUBLIC_*`.
8. Validar login/refresh/logout, cadastro/perfil, recuperação de senha com entrega SMTP real, catálogo/filtros/imagens, uploads/edição, carrinho/compra, pedidos recorrentes e avulsos, fornecedores, transportadoras, faturamento/pagamentos, reposição, promoções, análise e suporte. Testar tela de administrador e usuário comum. Conferir URLs de todas as imagens após reabrir a aplicação.
9. Fazer backup final e conferir se houve novas alterações na demonstração durante a validação. Trocar a URL da API no frontend e publicar apenas após homologação. Preservar o deploy e banco antigos enquanto testa o resultado.
10. Encerrar os recursos pagos da Heroku somente após backup restaurável, validação dos dados e imagens e aceite da nova demonstração. Conferir a página de billing/add-ons para confirmar que não ficou cobrança recorrente. O encerramento exige uma decisão explícita nessa etapa final; a solicitação atual prioriza preservação e avaliação.

## Limites relevantes ao projeto

- Uploads continuam passando pela API Django. A [Vercel limita corpo de request/response a 4,5 MB](https://vercel.com/docs/functions/limitations), incluindo o multipart. Os arquivos locais atuais são pequenos, mas essa restrição reduz o tamanho máximo futuro em relação à Heroku. Para preservar uploads maiores, será necessário upload direto assinado para Cloudinary; isso ainda não foi implementado.
- SQLite e arquivos de upload locais ficam restritos ao desenvolvimento. Produção exige PostgreSQL e Cloudinary; falta de configuração causa erro de inicialização em vez de gravar dados no filesystem da função.
- A aplicação não contém uma rotina comprovada de reset periódico da demonstração. A mensagem publicada foi ajustada para não prometer isso. Qualquer futuro reset deve partir de um seed privado e restaurável.
- A recuperação por e-mail precisa de credenciais e provedor SMTP válidos no novo host. Os testes atuais simulam o envio e não comprovam entrega real.
- A janela curta de restauração do Neon Free não substitui backups privados periódicos. Verificar o uso no painel e evitar monitoramento artificial que impeça a inatividade do banco.
- A chave Django encontrada já existia no histórico Git; as credenciais Cloudinary também estavam fixas no repositório antigo do servidor. Criar chave Django nova e rotacionar o segredo Cloudinary antes da publicação. Trocar a chave Django invalida sessões/tokens assinados antigos, algo aceitável para a demonstração. Não reutilizar a chave local preservada.

## Rollback

Antes do encerramento da Heroku, o rollback de infraestrutura é restaurar a URL anterior no frontend e recompilar. Se houver gravações na nova base, preservá-las em um dump separado antes do retorno: mudar a URL não sincroniza bancos. O manifest de imagens mantém os IDs novos e as referências antigas sem apagar assets. Os ZIPs/bundles e dumps privados mantêm as versões originais para recuperação independente do GitHub.
