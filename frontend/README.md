# B2B Soluções — frontend

Next.js 15, React 18, Pages Router, Manrope local e identidade visual roxa. Veja a [documentação da interface](../docs/INTERFACE.md) e as [instruções da aplicação completa](../README.md).

## Desenvolvimento

```powershell
npm ci
if (-not (Test-Path .env.local)) { Copy-Item .env.example .env.local }
npm run dev
```

Configure `API_URL=http://127.0.0.1:8000/api/` no `.env.local` e mantenha o Django em execução. `NEXT_PUBLIC_API_URL` continua aceito como alternativa para ambientes existentes. Valores `NEXT_PUBLIC_*` são públicos; nenhuma chave privada deve ser colocada neles.

## Organização

- `src/pages`: rotas e carregamento inicial via `getServerSideProps`.
- `src/components`: apresentação compartilhada e componentes por domínio.
- `src/lib/server`: acesso ao Django, sessão e carregadores SSR, exclusivos do servidor.
- `src/pages/api`: sessão e encaminhamento de requisições ao Django no mesmo domínio.
- `src/services`: operações iniciadas pela interface; `request.js` trata JSON, multipart e erros.
- `src/styles`: tokens, estrutura, catálogo e controles, com Tailwind para ajustes pontuais.
- `public/images/brand`: imagens originais geradas e comprimidas em WebP.

## Verificação

```powershell
npm run lint
npm run format:check
npm test
npm run build
npm start
```

O build exige a URL da API no ambiente, mas não consulta o banco para gerar as páginas. SSR e API routes exigem um runtime Next.js; exportação estática não serve para esta aplicação.

`npm run test:integration` depende de dois servidores locais e de uma **cópia descartável do banco**, com usuários de teste `ui-review-admin` (administrador) e `ui-review-buyer` (comprador), ambos com senha fictícia `test-password`, e ao menos um produto com estoque. O script verifica páginas, permissões, sessão, carrinho, checkout, cancelamento e multipart; cria registros na cópia. Configure `UI_TEST_URL` e `UI_TEST_API_URL` para as portas desejadas; os padrões são `127.0.0.1:3007` e `127.0.0.1:8010/api/`. O script rejeita hosts externos.

## Publicação

Configure `API_URL` no ambiente do servidor Next.js e publique esta revisão do Django junto com o frontend: carrinho, checkout e ações dos pedidos utilizam novos endpoints. Tokens permanecem em cookies HttpOnly e são validados pelo Django. A configuração `MEDIA_STORAGE` do backend continua escolhendo imagens locais ou Cloudinary; as imagens decorativas pertencem ao frontend.
