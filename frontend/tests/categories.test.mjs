import assert from 'node:assert/strict'
import test from 'node:test'
import { categoryHierarchy } from '../src/lib/categories.js'
import { normalizeSearch } from '../src/lib/format.js'

test('hierarquias grandes preservam todas as categorias sem alterar os registros originais', () => {
  const records = Array.from({ length: 500 }, (_, id) => ({
    id: id + 1,
    name: `Category ${id + 1}`,
    category: id < 10 ? null : (id % 10) + 1,
  }))
  const original = structuredClone(records)
  const flatten = (tree) => tree.flatMap((node) => [node.id, ...flatten(node.children)])
  const ids = flatten(categoryHierarchy(records))
  assert.equal(new Set(ids).size, 500)
  assert.equal(ids.length, 500)
  assert.deepEqual(records, original)
})

test('categorias antigas sem pai válido ou com ciclos aparecem uma única vez', () => {
  const records = [
    { id: 1, category: 2 },
    { id: 2, category: 1 },
    { id: 3, category: 99 },
    { id: 4, category: 4 },
  ]
  const flatten = (tree) => tree.flatMap((node) => [node.id, ...flatten(node.children)])
  assert.deepEqual(flatten(categoryHierarchy(records)).sort(), [1, 2, 3, 4])
})

test('busca de categorias aceita nomes sem acentos e ignora maiúsculas e minúsculas', () => {
  assert.ok(normalizeSearch('Papel Fotográfico').includes(normalizeSearch(' FOTOGRAFICO ')))
  assert.ok(normalizeSearch('Materiais de Escritório').includes(normalizeSearch('escritorio')))
})
