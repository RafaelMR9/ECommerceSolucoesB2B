# Produção preservada — 11/10/2026

## Resultado confirmado

Após autenticação na Heroku, o estado atual da demonstração foi preservado sem alterar o deploy, as configurações remotas ou os dados da aplicação. Foi criado somente um novo backup lógico, **b051**, em **11/10/2026 às 09:32:34 de São Paulo** (12:32:34 UTC).

O backup foi baixado, restaurado em um PostgreSQL 16 local isolado e comparado com uma leitura do PostgreSQL ativo. **As contagens e hashes das 26 tabelas correspondem integralmente ao banco ativo no momento da conferência.** A transação usada para essa comparação foi explicitamente somente leitura.

As migrações do Django unificado também passaram em uma cópia adicional do banco restaurado. Todos os registros das tabelas de negócio permaneceram iguais. A API de detalhes dos 13 produtos foi testada nessa cópia e devolveu corretamente as URLs completas das imagens.

## Recursos atuais

| Item | Estado consultado |
| --- | --- |
| App | `ecommercesolucoesb2b` |
| Release atual | `v47`, de 16/11/2024 |
| Commit do artefato publicado | `ee89adeef1b898352be312f3b4f8c247e90f56b5` |
| Stack | Heroku-22, região US |
| Processo web | Um dyno Basic com Gunicorn |
| PostgreSQL | 15.18, Essential-0 |
| Tamanho informado do banco ativo | 11,1 MB |
| Cobrança do add-on PostgreSQL | Até US$5/mês, além do dyno |
| Backup atual | `b051`, concluído, 95.190 bytes |

O banco é pequeno em relação ao limite de armazenamento gratuito avaliado para Neon. Ainda é necessário validar o consumo de compute e demais quotas na conta de destino. A cobrança da Heroku continua ativa; nenhum recurso foi desligado.

## Conteúdo preservado

Em `backups/heroku-current/`, ignorado pelo Git:

- Dump atual `heroku-b051-current.dump` e backup anterior concluído `heroku-b049-2024-12-28.dump`.
- Artefato exato do deploy, `heroku-current-slug.tgz`, com checksum SHA-256 conferido contra o informado pela Heroku.
- Cópia privada das variáveis do ambiente hospedado, incluindo credenciais, sem expor seus valores na saída dos comandos ou nos documentos públicos.
- Metadados do release e comparação do código publicado com o snapshot original de `ECommerceServer`.
- As **13 imagens referenciadas no banco**, todas baixadas e verificadas como arquivos de imagem, com SHA-256 e metadados Cloudinary. Total: 523.088 bytes.
- Relatórios de restauração, comparação somente leitura com produção, conflitos entre conjuntos de dados e validação das migrações no PostgreSQL.
- `preservation-manifest.json`, com identificação do backup, horário e hashes dos arquivos preservados.

O cluster local de validação está parado. Seus bancos restaurados foram mantidos nessa mesma pasta privada. Nenhuma restauração foi direcionada à Heroku.

O dump original foi preservado completo. Na restauração local foram omitidos somente objetos de plataforma, como extensões/privilégios específicos, usando uma lista de seleção registrada. As tabelas, dados, sequências, índices e restrições da aplicação foram restaurados; não ficaram restrições de integridade pendentes de validação.

As imagens preservadas correspondem às referências exatas do banco, incluindo versão e formato. O inventário não pretende copiar assets de outros projetos que porventura existam na conta Cloudinary. Nenhum asset foi enviado, modificado ou excluído na conta.

Essa pasta contém dados, credenciais e código histórico com segredos: mantenha-a privada e copie os backups para outro armazenamento privado antes de encerrar qualquer serviço. O `.gitignore` e a auditoria do índice Git foram conferidos; esses arquivos não estão preparados para publicação.

## Código efetivamente publicado

A comparação com o artefato da Heroku confirmou **96 arquivos de origem iguais** ao snapshot original de `ECommerceServer`, após normalizar quebras de linha e codificação. A diferença textual em `requirements.txt` é a remoção dos marcadores de ambiente das dependências; os nomes e versões dos pacotes são os mesmos.

Isso confirma a equivalência do código backend publicado com a cópia usada como referência na unificação. O artefato da Vercel/frontend ainda não foi obtido nesta etapa; a comparação de frontend continua sendo entre os diretórios fornecidos.

## Dados: produção não equivale às cópias locais

| Dados | SQLite local | SQLite do servidor | Heroku atual |
| --- | ---: | ---: | ---: |
| Usuários | 2 | 4 | 3 |
| Produtos | 13 | 14 | 13 |
| Categorias | 12 | 12 | 12 |
| Fornecedores | 3 | 3 | 3 |
| Transportadoras | 3 | 3 | 3 |
| Promoções | 1 | 1 | 5 |
| Pedidos de venda / itens | 1 / 1 | 1 / 1 | 0 / 0 |
| Pedidos de fornecedor / itens | 1 / 1 | 0 / 0 | 1 / 1 |
| Notas de venda / itens | 2 / 2 | 2 / 2 | 0 / 0 |
| Notas de fornecedor / itens | 0 / 0 | 0 / 0 | 1 / 1 |
| Tickets | 3 | 3 | 0 |
| Remessas | 1 | 1 | 0 |

A comparação registro a registro encontrou diferenças em **15 tabelas de negócio** entre a produção e cada SQLite. Mesmo tabelas com contagens iguais têm IDs ou valores diferentes: há conflitos em usuários, produtos, categorias e transportadoras. As 13 imagens da produção usam Cloudinary; o SQLite local usa arquivos locais.

Os três conjuntos continuam preservados separadamente. Nenhum foi substituído por outro e nenhum conflito foi resolvido silenciosamente. Os hashes dos dois SQLite originais continuam iguais aos capturados antes da unificação. O relatório privado `data-reconciliation-private.json` identifica os IDs exclusivos e os campos divergentes, sem colocar dados de contas nos documentos públicos.

Para a demonstração hospedada, uma primeira migração pode manter exatamente o conjunto atual da Heroku. Para reunir também os exemplos adicionais do ambiente local, deve-se montar uma base reconciliada em outra cópia, com decisões explícitas sobre valores conflitantes e remapeamento de relações. A quantidade de registros sozinha não permite escolher uma versão completa.

## O que falta antes de eliminar a cobrança

O bloqueio de autenticação e preservação do estado atual foi resolvido. Restam modernizar e testar as dependências para o runtime atual da Vercel, definir a base de demonstração, configurar Neon/Vercel e SMTP, rotacionar as credenciais previamente versionadas, homologar os fluxos publicados e só então desativar o dyno e o add-on pagos da Heroku. O roteiro está em [MIGRACAO.md](MIGRACAO.md).
