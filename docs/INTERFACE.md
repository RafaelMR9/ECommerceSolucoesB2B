# Interface e organização do código

A interface aplica a identidade aprovada: roxo de destaque, navegação escura, áreas claras, tipografia Manrope, espaçamento consistente e imagens de escritório. A composição é própria e utiliza somente recursos existentes da plataforma: catálogo, categorias, compras, recorrência, gestão e tickets. Não foram adicionadas ofertas semanais, avaliações, garantias ou marcas fictícias.

## Páginas e componentes

Todas as páginas foram revisadas, incluindo autenticação e recuperação de senha; início, busca, categorias e produtos; cadastros e promoções; carrinho e entrega; pedidos de compradores, vendas e fornecedores; pagamentos, crédito, ressuprimento, conta e suporte. Páginas de erro também seguem a identidade.

Botões, campos, alertas, tabelas, títulos e estados vazios ficam em `frontend/src/components/ui`. Estrutura, navegação, rodapé e modal ficam em `shared`. Formulários de produtos, categorias e parceiros são reutilizados entre cadastro e edição. Pedidos compartilham tabela, status e ações; cada rota configura o carregador e o contexto da página.

As tabelas têm rolagem horizontal contida, os formulários se adaptam à tela, a navegação mobile tem um menu acessível e o modal controla foco e Escape. O tema respeita preferência de movimento reduzido. Alterações de paleta e medidas comuns começam em `frontend/tailwind.config.js`.

`FormLayout` e `FormSection` organizam cadastros e edições com seções de campos e orientações laterais; `ProductOverview` reúne a apresentação, preço, disponibilidade, ficha técnica e ações do produto. Esses componentes usam classes Tailwind no JSX; `FormPanel`, `FormActions` e `Input` compartilham a apresentação e os estados dos formulários. Header, navegação administrativa e fundo do hero compartilham a mesma cor escura. Textos auxiliares usam um tom mais escuro, e os cabeçalhos das tabelas têm fundo roxo com texto branco.

As categorias são apresentadas em uma hierarquia recolhível, com ações administrativas em menus. A busca aceita termos sem acentos. O catálogo mantém “Todos os Produtos” acima da busca de categorias e limita a lista a 360 px no desktop e 240 px no celular; a rolagem acontece dentro da lista. No celular, os filtros começam recolhidos e fecham após a seleção. Links e dados continuam renderizados pelo servidor, enquanto busca local e abertura dos filtros são interações no cliente. Há testes para preservação de 500 categorias, registros legados órfãos/cíclicos e busca em português.

## Renderização e sessão

Os dois botões do hero têm a mesma largura, lado a lado no desktop e empilhados no celular. O hero é seguido diretamente pela seção de categorias, sem uma faixa adicional de atalhos. O hover do card de produto mantém a cor original da borda e aplica apenas a sombra já definida.

`ProductCard` é compartilhado pela página inicial e pelo catálogo, com classes Tailwind no próprio componente. O card usa moldura lilás para a fotografia original, categoria em etiqueta, informações de embalagem e preço em destaque. O selo de desconto e o preço anterior aparecem somente quando a promoção ativa reduz o preço de venda. A grade de produtos foi mantida; no celular, o card continua compacto, com fotografia à esquerda e informações à direita. Todo o conteúdo continua renderizado no servidor.

O título da aba é sempre “B2B Soluções · Sua Empresa em Movimento”, definido apenas em `_app.jsx`. Os títulos visíveis das páginas continuam específicos de cada tela. Início precede Catálogo na navegação da loja; as duas faixas de navegação compartilham as regras de hover e indicação da página atual. As orientações dos formulários e os filtros do catálogo acompanham o fluxo normal da página, sem posicionamento sticky. O rodapé usa uma faixa própria de marca, dois grupos de links e um cartão de atendimento; mantém o crédito ao desenvolvedor.

O contador do carrinho é renderizado no servidor, soma as quantidades de embalagens e fica oculto quando vazio. Ele considera o carrinho de vendas do comprador ou o carrinho de reposição do administrador. Leituras iguais são compartilhadas apenas dentro de cada requisição, sem cache entre contas. Adicionar, remover ou finalizar direciona para uma página com contagem atualizada. O perfil separa resumo da conta, dados cadastrais, condições de compra e atalhos em componentes próprios. A navegação administrativa é identificada na sua faixa e aparece antes dos links da loja. O rodapé organiza marca, atalhos e atendimento, com crédito centralizado ao desenvolvedor.

As páginas de negócio e autenticação usam `getServerSideProps`. Dados e verificações de sessão são carregados no servidor antes do HTML chegar ao navegador; interações de formulário permanecem no cliente. `withSession` evita repetir a lógica de sessão, autorização administrativa e tratamento de indisponibilidade. As páginas privadas usam `Cache-Control: private, no-store`.

O navegador utiliza API routes do Next.js no mesmo domínio. A URL do Django pode ficar em `API_URL`, exclusiva do servidor; `NEXT_PUBLIC_API_URL` permanece como alternativa de compatibilidade. A sessão usa cookies HttpOnly, SameSite=Lax e Secure em produção HTTPS. O servidor renova o access token, e o Django confere sua assinatura; decodificação local só lê vencimento e identificador. Tokens e hashes de senha não são colocados nas propriedades SSR.

As API routes aceitam URLs com ou sem barra final, sem redirecionamento. Isso evita reenvio de corpos multipart por clientes HTTP e mantém arquivos e campos intactos no encaminhamento ao Django.

## Correções dos fluxos

Carrinho e checkout foram movidos para operações transacionais no Django. O servidor determina preços e promoções, confere estoque, quantidade, autorização de compra/faturamento e propriedade do carrinho. Pedido, itens de nota e confirmação são gravados juntos; uma falha desfaz a transação. Reposição mantém um fornecedor por carrinho, conforme a estrutura original dos pedidos.

Cancelamento, preparação, envio, recebimento e pagamento também são operações transacionais com permissões e validação de estado. Cancelamento e recebimento de reposição não podem devolver/adicionar estoque duas vezes. O envio permite escolher uma transportadora. Regularizar um pagamento libera compras quando não há outras pendências.

O serializer de usuário deixa a senha somente para escrita e utiliza `set_password` na atualização. Recuperação exige token válido e não vencido, vinculado à conta; consultar o link não o consome e a troca de senha invalida os tokens. Edição de produto sem novo arquivo preserva a imagem atual. Atualizações multipart também preservam campos omitidos, incluindo visibilidade; o frontend usa PATCH para alterações parciais. Nenhuma alteração de esquema ou migração de dados foi necessária.

## Imagens e fonte

`public/images/brand/hero-workspace.webp` e `recurring-supplies.webp` são as duas imagens originais geradas para esta identidade e comprimidas para uso no site. Não substituem fotografias de produtos nem representam itens à venda. Direções utilizadas: escritório contemporâneo com notebook sem marca, iluminação violeta e espaço para texto; composição de cadernos, papel, embalagens e canetas sobre uma mesa clara com luz lilás. A referência de loja inspirou hierarquia e contraste, sem reprodução de logo, textos ou composição visual exata.

Manrope é servida localmente em `src/assets/fonts`; o arquivo variável, com pesos de 200 a 800, vem do [repositório oficial Google Fonts](https://github.com/google/fonts/tree/main/ofl/manrope). Sua licença acompanha o arquivo em `OFL.txt`. O favicon reutiliza o símbolo Boxes da marca, sobre fundo roxo, em SVG e ICO (16, 32 e 48 px); a licença Lucide acompanha os arquivos em `public/favicon-LICENSE.txt`. As imagens existentes dos produtos continuam vindas do Django, com armazenamento local em desenvolvimento e Cloudinary no ambiente configurado para produção.

Os tamanhos compartilhados ficam em `frontend/tailwind.config.js`: corpo de 16 px, controles de 15 px, textos auxiliares de 14 px e legendas de 13 px. Cada variante de botão define suas cores normais e de hover; a variante `inverse` atende às superfícies escuras. Controles principais têm área mínima de toque de 44 px. Botões, links e títulos usam iniciais maiúsculas com conectivos em minúsculas; nomes de categorias são formatados apenas na apresentação. O header começa diretamente pela marca, busca e conta. Nomes longos ficam limitados a 160 px, com reticências e nome completo no título do link. Até 1100 px, o botão de menu abre as navegações administrativa e da loja em seções com colunas definidas, sem rolagem horizontal; Escape fecha e devolve o foco ao botão. Até 850 px, a busca ocupa sua própria linha. As tabelas mantêm a rolagem dentro de seu contêiner.

A interface usa somente Tailwind para os estilos dos componentes. Paleta, tipografia, sombras, raios e gradientes compartilhados ficam em `frontend/tailwind.config.js`. `styles/globals.css` carrega o Tailwind e define padrões globais de foco, seleção e movimento reduzido com `@apply`; os nove arquivos CSS de componentes foram removidos. `cn` combina classes usando `tailwind-merge` (compatível com Tailwind 3), preservando as variantes de fonte e cor do tema. Classes condicionais são escritas completas para que o Tailwind gere os estados corretos. Contêineres, links de navegação e células de tabela são componentes reutilizáveis; a renderização SSR e os serviços de negócio permanecem iguais.

## Validação e publicação

### Revisão final do frontend

A sessão no cliente usa diretamente as propriedades recebidas por SSR, sem copiar o usuário para outro estado nem sincronizá-lo por efeito. Login e edição do perfil atualizam a sessão/dados no servidor e navegam para uma página com dados novos. Mudanças de endereço reiniciam o estado da página para impedir que formulários e conversas reaproveitem dados de outro registro; mudanças apenas de âncora preservam esse estado.

`DetailItem` reúne a apresentação de dados em produtos, perfil e parceiros. `PurchaseLayout` e `OrderSummary` compartilham a estrutura do carrinho e da compra. Os cartões de parceiros e solicitações reutilizam `FeatureLink`; os grupos do rodapé são definidos em uma lista simples. Esses componentes substituem duplicação de marcação e classes, sem um sistema de configuração de páginas.

O modal usa o elemento HTML `dialog`: o navegador mantém o restante da página inativo, trata a navegação por teclado e devolve o foco ao controle de origem. A confirmação é um formulário, portanto campos obrigatórios, como a transportadora, recebem validação nativa. O diálogo tem altura limitada e rolagem própria. Em conteúdo extenso, o foco inicial vai para o título para mostrar o começo da mensagem. Referência: [dialog no MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog).

A busca usa `normalizeSearch` em categorias, produtos e parceiros, aceitando nomes sem acentos e espaços nas extremidades. O carregamento compartilhado de parceiros preserva links antigos e ignora parâmetros repetidos que antes provocavam erro. A validação de senha confere as letras e o tamanho indicados pelo formulário. O proxy permite o espaço adicional de cabeçalhos e campos multipart, evitando rejeitar antecipadamente uma imagem de 4 MB; a API mantém a validação do arquivo.

As 43 telas foram conferidas em 320, 768 e 1440 px, com estados de administrador, comprador, autenticação, listas vazias e preenchidas, agendamento, recuperação válida/inválida e erros. Testes adicionais usaram nomes com até 255 caracteres, mais de 500 categorias e modais em uma tela de 400 px de altura. Etiquetas e links de retorno agora acomodam nomes extensos. No celular, ações de formulário ocupam a largura disponível; tabelas mantêm larguras legíveis com rolagem contida, e documentos como CNPJ não são partidos em várias linhas.

Foram executados 14 testes unitários e 78 verificações integradas de páginas e permissões, além de carrinho, checkout, cancelamento, multipart e preservação de imagens. A revisão utiliza uma cópia descartável do SQLite, restaurada após os testes. O banco original e os serviços hospedados permanecem intactos.

Foram verificados build de produção, lint, formatação, testes de moeda/datas/promoções/erros, testes Django dos fluxos, páginas SSR e permissões de administrador/comprador, cookies, checkout completo e preservação de imagem em multipart. A revisão visual inclui desktop e mobile.

Os testes integrados usam uma cópia isolada do SQLite, e os testes Django usam banco temporário. O banco original, os dados hospedados e os serviços de produção não foram modificados. A documentação contém somente caminhos, configuração e descrição de comportamentos; não inclui chaves, dumps ou configurações privadas.

Frontend e backend precisam ser publicados juntos, pois a interface depende dos novos endpoints. Esta revisão não executa deploy, migração para Neon ou encerramento da Heroku; esses passos continuam separados e dependem da validação no ambiente hospedado.
