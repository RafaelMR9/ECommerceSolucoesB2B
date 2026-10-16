import assert from 'node:assert/strict'
import test from 'node:test'
import { loadOrders } from '../src/lib/server/orderLoaders.js'

const orders = [
  { id: 1, deliveryFrequency: null, cancelled: false },
  { id: 2, deliveryFrequency: 10, cancelled: false },
  { id: 3, deliveryFrequency: null, cancelled: null },
  { id: 4, deliveryFrequency: 10, cancelled: null },
  { id: 5, deliveryFrequency: null, cancelled: true },
]

const scenarios = [
  ['comprador', {}, ['orders/salesOrder/user/?user=7'], [1, 3, 5]],
  ['compras recorrentes', { recurring: true }, ['orders/salesOrder/user/?user=7'], [2, 4]],
  ['administração', { admin: true }, ['orders/salesOrder/', 'users/', 'carriers/'], [1, 3, 5]],
  [
    'compras recorrentes na administração',
    { admin: true, recurring: true },
    ['orders/salesOrder/', 'users/', 'carriers/'],
    [2, 4],
  ],
  ['reposição', { supplier: true }, ['orders/supplierOrder/', 'suppliers/'], [1, 3, 5]],
  [
    'reposição recorrente',
    { supplier: true, recurring: true },
    ['orders/supplierOrder/', 'suppliers/'],
    [2, 4],
  ],
  ['pagamentos', { admin: true, payments: true }, ['orders/salesOrder/', 'users/'], [3]],
  [
    'pagamentos recorrentes',
    { admin: true, payments: true, recurring: true },
    ['orders/salesOrder/', 'users/'],
    [4],
  ],
]

for (const [name, options, expectedPaths, expectedIds] of scenarios) {
  test(`carrega apenas os dados necessários para ${name}`, async () => {
    const paths = []
    const api = async (path) => {
      paths.push(path)
      return path.startsWith('orders/') ? orders : [{ id: 8 }]
    }
    const result = await loadOrders({ api, user: { id: 7 } }, options)
    assert.deepEqual(paths.sort(), [...expectedPaths].sort())
    assert.deepEqual(
      result.orders.map((order) => order.id),
      expectedIds
    )
    assert.deepEqual(result.companies, expectedPaths.length > 1 ? [{ id: 8 }] : [])
    assert.deepEqual(result.carriers, expectedPaths.includes('carriers/') ? [{ id: 8 }] : [])
  })
}
