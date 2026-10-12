import test from 'node:test'
import assert from 'node:assert/strict'
import { money, date, activePromotion, errorFields } from '../src/lib/format.js'

test('date-only delivery dates do not move back a day in Brazilian time', () => {
  assert.equal(date('2026-10-11'), '11/10/2026')
  assert.equal(date(null), '—')
})
test('currency accepts numeric strings returned by an API', () => {
  assert.equal(money('1234.5').replace(/\s/g, ' '), 'R$ 1.234,50')
})
test('reused date formatters preserve date-only and date-time output in Brazilian time', () => {
  assert.equal(date('2026-10-12T12:00:00Z'), '12/10/2026')
  assert.equal(date('2026-10-12T12:00:00Z', true), '12/10/2026, 09:00')
  assert.equal(date('2026-10-12'), '12/10/2026')
})
test('only a currently active promotion for this product is applied', () => {
  const product = { id: 5 },
    now = Date.parse('2026-10-11T12:00:00Z')
  const promotions = [
    { product: 5, startDate: '2020-01-01', endDate: '2020-01-02', salePrice: 1 },
    { product: 6, startDate: '2026-01-01', endDate: '2027-01-01', salePrice: 2 },
    { product: 5, startDate: '2026-01-01', endDate: '2027-01-01', salePrice: 25 },
  ]
  assert.equal(activePromotion(product, promotions, now).salePrice, 25)
})
test('network errors remain visible and API field errors retain their field', () => {
  assert.deepEqual(errorFields(new Error('Connection unavailable')), {
    detail: 'Connection unavailable',
  })
  assert.deepEqual(errorFields(new Error('{"quantity":["Insufficient stock"]}')), {
    quantity: 'Insufficient stock',
  })
})
