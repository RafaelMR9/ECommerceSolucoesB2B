import assert from 'node:assert/strict'
import test from 'node:test'
import { getAccessToken, getSession, sameOrigin } from '../src/lib/server/session.js'
import { withSession } from '../src/lib/server/page.js'

function context(cookies = { b2b_access: 'acesso' }) {
  return {
    req: { cookies, headers: { host: 'localhost:3000' } },
    res: {
      headers: {},
      setHeader(name, value) {
        this.headers[name] = value
      },
    },
    resolvedUrl: '/profile',
  }
}

test('encaminhamento com token existente não consulta o perfil nem interpreta o JWT', async (t) => {
  const fetch = t.mock.method(globalThis, 'fetch')
  const { req, res } = context()
  assert.equal(await getAccessToken(req, res), 'acesso')
  assert.equal(fetch.mock.callCount(), 0)
})

test('perfil recebe o contador atual sem buscar o pedido e seus itens separadamente', async (t) => {
  const user = { id: 1, cartCount: 7 }
  const fetch = t.mock.method(globalThis, 'fetch', async () => Response.json(user))
  const result = await withSession()(context())
  assert.equal(result.props.initialCartCount, 7)
  assert.deepEqual(result.props.initialUser, user)
  assert.equal(fetch.mock.callCount(), 1)
  assert.ok(fetch.mock.calls[0].arguments[0].endsWith('/users/me/'))
})

test('chamadas iguais são reutilizadas apenas dentro do mesmo carregamento', async (t) => {
  let userId = 1
  const fetch = t.mock.method(globalThis, 'fetch', async (url) =>
    Response.json(url.endsWith('/users/me/') ? { id: userId, cartCount: 0 } : [{ id: 3 }])
  )
  const page = withSession(async ({ api }) => {
    const [first, second] = await Promise.all([
      api('products/categories/'),
      api('products/categories/'),
    ])
    assert.equal(first, second)
    return { categories: first }
  })
  assert.equal((await page(context())).props.initialUser.id, 1)
  userId = 2
  assert.equal((await page(context({ b2b_access: 'outra-conta' }))).props.initialUser.id, 2)
  assert.equal(fetch.mock.callCount(), 4)
})

test('token recusado é renovado antes de identificar a sessão e mantém cookies protegidos', async (t) => {
  const calls = []
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    calls.push({ url, options })
    if (url.endsWith('/token/refresh/'))
      return Response.json({ access: 'renovado', access_max_age: 600 })
    return options.headers.Authorization === 'Bearer renovado'
      ? Response.json({ id: 2, cartCount: 0 })
      : new Response(null, { status: 401 })
  })
  const { req, res } = context({ b2b_access: 'expirado', b2b_refresh: 'renovacao' })
  req.headers['x-forwarded-proto'] = 'https'
  const session = await getSession(req, res)
  assert.equal(session.user.id, 2)
  assert.equal(session.access, 'renovado')
  assert.equal(calls.length, 3)
  const [cookie] = res.headers['Set-Cookie']
  assert.ok(
    cookie.includes('HttpOnly') && cookie.includes('Secure') && cookie.includes('SameSite=Lax')
  )
})

test('falha temporária não tenta renovar a sessão nem repete a chamada', async (t) => {
  const fetch = t.mock.method(globalThis, 'fetch', async () => new Response(null, { status: 503 }))
  const { req, res } = context({ b2b_access: 'acesso', b2b_refresh: 'renovacao' })
  await assert.rejects(getSession(req, res), { status: 503 })
  assert.equal(fetch.mock.callCount(), 1)
  assert.equal(res.headers['Set-Cookie'], undefined)
})

test('renovação inválida encerra a sessão sem consultar dados protegidos', async (t) => {
  const fetch = t.mock.method(globalThis, 'fetch', async () => new Response(null, { status: 401 }))
  const { req, res } = context({ b2b_refresh: 'invalida' })
  assert.equal(await getSession(req, res), null)
  assert.equal(fetch.mock.callCount(), 1)
  assert.ok(res.headers['Set-Cookie'].every((cookie) => cookie.includes('Max-Age=0')))
})

test('páginas administrativas não carregam seus dados para uma conta compradora', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({ id: 1, is_superuser: false }))
  let loaded = false
  const page = withSession(
    async () => {
      loaded = true
      return {}
    },
    { admin: true }
  )
  assert.deepEqual((await page(context())).redirect, { destination: '/', permanent: false })
  assert.equal(loaded, false)
})

test('ações rejeitam origens externas mesmo com cookies de sessão', () => {
  const { req } = context()
  req.headers.origin = 'https://outro.example'
  assert.equal(sameOrigin(req), false)
  req.headers.origin = 'http://localhost:3000'
  assert.equal(sameOrigin(req), true)
  req.headers['sec-fetch-site'] = 'cross-site'
  assert.equal(sameOrigin(req), false)
})
