import assert from 'node:assert/strict'
import test from 'node:test'
import { productCards } from '../src/lib/catalog.js'

const now = Date.parse('2026-10-12T12:00:00Z')
const product = {
  id: 5,
  name: 'Produto',
  category: 3,
  image: null,
  packaging: 2,
  salePrice: '100.00',
  costPrice: '50.00',
  description: 'Not shown on cards',
}

test('cards incluem apenas os dados exibidos e mantêm a primeira promoção vigente', () => {
  const promotions = [
    { product: 5, startDate: '2020-01-01', endDate: '2020-01-02', salePrice: 1 },
    { product: 6, startDate: '2026-01-01', endDate: '2027-01-01', salePrice: 2 },
    { product: 5, startDate: '2026-01-01', endDate: '2027-01-01', salePrice: 25 },
    { product: 5, startDate: '2026-01-01', endDate: '2027-01-01', salePrice: 30 },
  ]
  const original = structuredClone({ product, promotions })
  const [card] = productCards([product], [{ id: 3, name: 'Tecnologia' }], promotions, now)
  assert.deepEqual(card, {
    product: { id: 5, name: 'Produto', image: null, packaging: 2, salePrice: '100.00' },
    categoryName: 'Tecnologia',
    promotion: { salePrice: 25 },
  })
  assert.deepEqual({ product, promotions }, original)
})

test('dados podem ser serializados mesmo sem categorias, promoções ou produtos', () => {
  const cards = productCards([product], [], [], now)
  assert.equal(cards[0].categoryName, null)
  assert.equal(cards[0].promotion, null)
  assert.deepEqual(JSON.parse(JSON.stringify(cards)), cards)
  assert.deepEqual(productCards([], [], [], now), [])
})

test('promoções são válidas também nas datas de início e fim', () => {
  const promotion = {
    product: 5,
    startDate: new Date(now).toISOString(),
    endDate: new Date(now).toISOString(),
    salePrice: 0,
  }
  assert.deepEqual(productCards([product], [], [promotion], now)[0].promotion, { salePrice: 0 })
  assert.equal(productCards([product], [], [promotion], now + 1)[0].promotion, null)
  assert.equal(productCards([product], [], [promotion], now - 1)[0].promotion, null)
})
