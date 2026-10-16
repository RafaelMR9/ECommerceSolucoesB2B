import assert from 'node:assert/strict'
import test from 'node:test'
import { apiRequest } from '../src/services/request.js'

test('consultas não enviam corpo nem cabeçalho de JSON', async (t) => {
  const fetch = t.mock.method(globalThis, 'fetch', async () => Response.json([{ id: 1 }]))
  assert.deepEqual(await apiRequest('/api/products'), [{ id: 1 }])
  assert.deepEqual(fetch.mock.calls[0].arguments, ['/api/products', { method: 'GET' }])
})

test('dados de formulário comuns são enviados como JSON', async (t) => {
  const fetch = t.mock.method(globalThis, 'fetch', async () => Response.json({ id: 1 }))
  const data = { name: 'Produto', visible: false, quantity: 0 }
  await apiRequest('/api/products', 'POST', data)
  assert.deepEqual(fetch.mock.calls[0].arguments[1], {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  })
})

test('uploads preservam o FormData e deixam o navegador definir o cabeçalho multipart', async (t) => {
  const fetch = t.mock.method(globalThis, 'fetch', async () => Response.json({ id: 1 }))
  const data = new FormData()
  data.append('image', new Blob(['imagem'], { type: 'image/png' }), 'produto.png')
  await apiRequest('/api/products', 'PATCH', data)
  const options = fetch.mock.calls[0].arguments[1]
  assert.equal(options.body, data)
  assert.equal(options.headers, undefined)
})

test('respostas sem conteúdo retornam null', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response(null, { status: 204 }))
  assert.equal(await apiRequest('/api/products/1', 'DELETE'), null)
})

test('erros preservam as mensagens dos campos retornadas pela API', async (t) => {
  const errors = { quantity: ['Estoque insuficiente.'] }
  t.mock.method(globalThis, 'fetch', async () => Response.json(errors, { status: 400 }))
  await assert.rejects(apiRequest('/api/cart', 'POST', {}), {
    message: JSON.stringify(errors),
  })
})
