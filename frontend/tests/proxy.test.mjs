import assert from 'node:assert/strict'
import { Readable } from 'node:stream'
import test from 'node:test'
import handler from '../src/pages/api/backend/[...path].js'

function context(method, path, cookies = {}) {
  const req = Readable.from([])
  Object.assign(req, {
    method,
    query: { path },
    cookies,
    headers: { host: 'localhost:3000', origin: 'http://localhost:3000' },
  })
  const res = {
    headers: {},
    statusCode: 200,
    setHeader(name, value) {
      this.headers[name] = value
    },
    status(code) {
      this.statusCode = code
      return this
    },
    json(body) {
      this.body = body
      return this
    },
    send(body) {
      this.body = body
      return this
    },
    end() {},
  }
  return { req, res }
}

test('exclusão de token de recuperação encaminha a sessão autenticada', async (t) => {
  const fetch = t.mock.method(globalThis, 'fetch', async () => new Response(null, { status: 204 }))
  const { req, res } = context('DELETE', ['users', 'passwordReset', '15', 'delete'], {
    b2b_access: 'acesso-de-teste',
  })
  await handler(req, res)
  assert.equal(res.statusCode, 204)
  assert.equal(fetch.mock.callCount(), 1)
  const [url, options] = fetch.mock.calls[0].arguments
  assert.ok(url.endsWith('/users/passwordReset/15/delete/'))
  assert.equal(options.headers.Authorization, 'Bearer acesso-de-teste')
})

test('exclusão de token sem sessão é rejeitada antes de chamar o backend', async (t) => {
  const fetch = t.mock.method(globalThis, 'fetch')
  const { req, res } = context('DELETE', ['users', 'passwordReset', '15', 'delete'])
  await handler(req, res)
  assert.equal(res.statusCode, 401)
  assert.equal(fetch.mock.callCount(), 0)
})

test('consulta pública de recuperação não encaminha credenciais da conta', async (t) => {
  const fetch = t.mock.method(globalThis, 'fetch', async () => Response.json({ status: false }))
  const { req, res } = context('GET', ['users', 'passwordReset', 'checkExistence'], {
    b2b_access: 'acesso-de-teste',
  })
  await handler(req, res)
  assert.equal(res.statusCode, 200)
  assert.equal(fetch.mock.callCount(), 1)
  assert.equal(fetch.mock.calls[0].arguments[1].headers.Authorization, undefined)
})
