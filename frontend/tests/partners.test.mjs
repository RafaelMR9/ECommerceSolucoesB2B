import assert from 'node:assert/strict'
import test from 'node:test'
import { loadPartners } from '../src/lib/server/partnerLoaders.js'

const api = async (path) => {
  assert.equal(path, 'suppliers/')
  return [
    { id: 1, name: 'Papel Fotográfico' },
    { id: 2, name: 'Escritório' },
  ]
}

test('busca de parceiros aceita nomes sem acentos e ignora espaços nas extremidades', async () => {
  const result = await loadPartners({ api, query: { search: ' FOTOGRAFICO ' } }, 'suppliers')
  assert.deepEqual(
    result.partners.map((partner) => partner.id),
    [1]
  )
})

test('parâmetros de busca repetidos não interrompem a listagem de parceiros', async () => {
  const result = await loadPartners({ api, query: { fetchSuppliers: ['one', 'two'] } }, 'suppliers')
  assert.equal(result.search, '')
  assert.equal(result.partners.length, 2)
})

test('links antigos de busca continuam funcionando', async () => {
  const result = await loadPartners({ api, query: { fetchSuppliers: 'escritorio' } }, 'suppliers')
  assert.deepEqual(
    result.partners.map((partner) => partner.id),
    [2]
  )
})
