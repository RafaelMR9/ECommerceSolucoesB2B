import test from 'node:test'
import assert from 'node:assert/strict'
import { money, date, activePromotion, errorFields, errorMessage } from '../src/lib/format.js'

test('datas de entrega sem horário não retrocedem um dia no fuso brasileiro', () => {
  assert.equal(date('2026-10-11'), '11/10/2026')
  assert.equal(date(null), '—')
})
test('formatação de moeda aceita números retornados pela API como texto', () => {
  assert.equal(money('1234.5').replace(/\s/g, ' '), 'R$ 1.234,50')
})
test('formatadores reutilizados preservam a data e o horário no fuso brasileiro', () => {
  assert.equal(date('2026-10-12T12:00:00Z'), '12/10/2026')
  assert.equal(date('2026-10-12T12:00:00Z', true), '12/10/2026, 09:00')
  assert.equal(date('2026-10-12'), '12/10/2026')
})
test('somente uma promoção vigente do próprio produto é aplicada', () => {
  const product = { id: 5 },
    now = Date.parse('2026-10-11T12:00:00Z')
  const promotions = [
    { product: 5, startDate: '2020-01-01', endDate: '2020-01-02', salePrice: 1 },
    { product: 6, startDate: '2026-01-01', endDate: '2027-01-01', salePrice: 2 },
    { product: 5, startDate: '2026-01-01', endDate: '2027-01-01', salePrice: 25 },
  ]
  assert.equal(activePromotion(product, promotions, now).salePrice, 25)
})
test('erros de rede mantêm a mensagem e erros de validação permanecem associados aos campos', () => {
  assert.deepEqual(errorFields(new Error('Connection unavailable')), {
    detail: 'Connection unavailable',
  })
  const error = new Error('Não foi possível concluir a ação.')
  error.fields = { quantity: ['Insufficient stock'] }
  assert.deepEqual(errorFields(error), {
    quantity: 'Insufficient stock',
  })
})

test('mensagem geral reúne os erros dos campos sem alterar a mensagem original', () => {
  assert.equal(errorMessage(new Error('Conexão indisponível.')), 'Conexão indisponível.')
  const error = new Error('Não foi possível concluir a ação.')
  error.fields = { name: ['Informe o nome.'], detail: '', image: ['Imagem inválida.'] }
  assert.equal(errorMessage(error), 'Informe o nome. Imagem inválida.')
})
