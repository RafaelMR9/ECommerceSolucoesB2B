import assert from 'node:assert/strict'
import test from 'node:test'
import { loadCartItems } from '../src/lib/server/orderLoaders.js'

test('consulta do carrinho carrega apenas o pedido não finalizado do comprador ou administrador', async () => {
  for (const [admin, kind] of [
    [false, 'Sales'],
    [true, 'Supplier'],
  ]) {
    const paths = []
    const api = async (path) => {
      paths.push(path)
      return paths.length === 1 ? [{ id: 42 }] : [{ quantity: 3 }]
    }
    const result = await loadCartItems({ api, user: { id: 7, is_superuser: admin } })
    assert.deepEqual(paths, [
      `orders/${kind.toLowerCase()}Order/getUnfinished/?user=7`,
      `orders/item${kind}Order/42/?user=7`,
    ])
    assert.deepEqual(result, { order: { id: 42 }, items: [{ quantity: 3 }] })
  }
})

test('carrinhos vazios não consultam itens nem o catálogo de produtos', async () => {
  const paths = []
  const cart = await loadCartItems({
    user: { id: 7, is_superuser: false },
    api: async (path) => {
      paths.push(path)
      return []
    },
  })
  assert.equal(paths.length, 1)
  assert.deepEqual(cart, { order: null, items: [] })
})
