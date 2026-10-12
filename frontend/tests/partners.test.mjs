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

test('partner search accepts names without accents and surrounding spaces', async () => {
  const result = await loadPartners({ api, query: { search: ' FOTOGRAFICO ' } }, 'suppliers')
  assert.deepEqual(
    result.partners.map((partner) => partner.id),
    [1]
  )
})

test('repeated query parameters do not crash the partner list', async () => {
  const result = await loadPartners({ api, query: { fetchSuppliers: ['one', 'two'] } }, 'suppliers')
  assert.equal(result.search, '')
  assert.equal(result.partners.length, 2)
})

test('legacy search links remain supported', async () => {
  const result = await loadPartners({ api, query: { fetchSuppliers: 'escritorio' } }, 'suppliers')
  assert.deepEqual(
    result.partners.map((partner) => partner.id),
    [2]
  )
})
