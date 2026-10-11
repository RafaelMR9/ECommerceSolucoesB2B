# Interface e organização do código

A interface aplica a identidade aprovada: roxo de destaque, navegação escura, áreas claras, tipografia Manrope, espaçamento consistente e imagens de escritório. A composição é própria e utiliza somente recursos existentes da plataforma: catálogo, categorias, compras, recorrência, gestão e tickets. Não foram adicionadas ofertas semanais, avaliações, garantias ou marcas fictícias.

## Páginas e componentes

Todas as páginas foram revisadas, incluindo autenticação e recuperação de senha; início, busca, categorias e produtos; cadastros e promoções; carrinho e entrega; pedidos de compradores, vendas e fornecedores; pagamentos, crédito, ressuprimento, conta e suporte. Páginas de erro também seguem a identidade.

Botões, campos, alertas, tabelas, títulos e estados vazios ficam em `frontend/src/components/ui`. Estrutura, navegação, rodapé e modal ficam em `shared`. Formulários de produtos, categorias e parceiros são reutilizados entre cadastro e edição. Pedidos compartilham tabela, status e ações; cada rota configura o carregador e o contexto da página.

As tabelas têm rolagem horizontal contida, os formulários se adaptam à tela, a navegação mobile tem um menu acessível e o modal controla foco e Escape. O tema respeita preferência de movimento reduzido. Alterações de paleta e medidas comuns começam em `styles/tokens.css`.

## Renderização e sessão

As páginas de negócio e autenticação usam `getServerSideProps`. Dados e verificações de sessão são carregados no servidor antes do HTML chegar ao navegador; interações de formulário permanecem no cliente. `withSession` evita repetir a lógica de sessão, autorização administrativa e tratamento de indisponibilidade. As páginas privadas usam `Cache-Control: private, no-store`.

O navegador utiliza API routes do Next.js no mesmo domínio. A URL do Django pode ficar em `API_URL`, exclusiva do servidor; `NEXT_PUBLIC_API_URL` permanece como alternativa de compatibilidade. A sessão usa cookies HttpOnly, SameSite=Lax e Secure em produção HTTPS. O servidor renova o access token, e o Django confere sua assinatura; decodificação local só lê vencimento e identificador. Tokens e hashes de senha não são colocados nas propriedades SSR.

As API routes aceitam URLs com ou sem barra final, sem redirecionamento. Isso evita reenvio de corpos multipart por clientes HTTP e mantém arquivos e campos intactos no encaminhamento ao Django.

## Correções dos fluxos

Carrinho e checkout foram movidos para operações transacionais no Django. O servidor determina preços e promoções, confere estoque, quantidade, autorização de compra/faturamento e propriedade do carrinho. Pedido, itens de nota e confirmação são gravados juntos; uma falha desfaz a transação. Reposição mantém um fornecedor por carrinho, conforme a estrutura original dos pedidos.

Cancelamento, preparação, envio, recebimento e pagamento também são operações transacionais com permissões e validação de estado. Cancelamento e recebimento de reposição não podem devolver/adicionar estoque duas vezes. O envio permite escolher uma transportadora. Regularizar um pagamento libera compras quando não há outras pendências.

O serializer de usuário deixa a senha somente para escrita e utiliza `set_password` na atualização. Recuperação exige token válido e não vencido, vinculado à conta; consultar o link não o consome e a troca de senha invalida os tokens. Edição de produto sem novo arquivo preserva a imagem atual. Atualizações multipart também preservam campos omitidos, incluindo visibilidade; o frontend usa PATCH para alterações parciais. Nenhuma alteração de esquema ou migração de dados foi necessária.

## Imagens e fonte

`public/images/brand/hero-workspace.webp` e `recurring-supplies.webp` são as duas imagens originais geradas para esta identidade e comprimidas para uso no site. Não substituem fotografias de produtos nem representam itens à venda. Direções utilizadas: escritório contemporâneo com notebook sem marca, iluminação violeta e espaço para texto; composição de cadernos, papel, embalagens e canetas sobre uma mesa clara com luz lilás. A referência de loja inspirou hierarquia e contraste, sem reprodução de logo, textos ou composição visual exata.

Manrope é servida localmente em `src/assets/fonts`; sua licença acompanha o arquivo em `OFL.txt`. As imagens existentes dos produtos continuam vindas do Django, com armazenamento local em desenvolvimento e Cloudinary no ambiente configurado para produção.

## Validação e publicação

Foram verificados build de produção, lint, formatação, testes de moeda/datas/promoções/erros, testes Django dos fluxos, páginas SSR e permissões de administrador/comprador, cookies, checkout completo e preservação de imagem em multipart. A revisão visual inclui desktop e mobile.

Os testes integrados usam uma cópia isolada do SQLite, e os testes Django usam banco temporário. O banco original, os dados hospedados e os serviços de produção não foram modificados. A documentação contém somente caminhos, configuração e descrição de comportamentos; não inclui chaves, dumps ou configurações privadas.

Frontend e backend precisam ser publicados juntos, pois a interface depende dos novos endpoints. Esta revisão não executa deploy, migração para Neon ou encerramento da Heroku; esses passos continuam separados e dependem da validação no ambiente hospedado.
