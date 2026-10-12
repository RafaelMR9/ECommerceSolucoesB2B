import assert from 'node:assert/strict'
import test from 'node:test'
import { countCartItems, loadCartItems } from '../src/lib/server/orderLoaders.js'

test('cart badges count quantities, including repeated products, and return zero when empty', () => {
  assert.equal(countCartItems([]), 0)
  assert.equal(
    countCartItems([
      { product: 1, quantity: 2 },
      { product: 1, quantity: '3' },
      { product: 2, quantity: 1 },
    ]),
    6
  )
})

test('cart reads stay scoped to the buyer or administrator and only load an unfinished order', async () => {
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
    assert.equal(countCartItems(result.items), 3)
  }
})

test('empty carts do not fetch items or the product catalog', async () => {
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
