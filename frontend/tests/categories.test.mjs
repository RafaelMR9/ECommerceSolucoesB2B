import assert from 'node:assert/strict'
import test from 'node:test'
import { categoryHierarchy, categorySearchText } from '../src/lib/categories.js'

test('large hierarchies preserve every category without changing source records', () => {
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

test('orphaned and cyclic legacy categories remain reachable exactly once', () => {
  const records = [
    { id: 1, category: 2 },
    { id: 2, category: 1 },
    { id: 3, category: 99 },
    { id: 4, category: 4 },
  ]
  const flatten = (tree) => tree.flatMap((node) => [node.id, ...flatten(node.children)])
  assert.deepEqual(flatten(categoryHierarchy(records)).sort(), [1, 2, 3, 4])
})

test('category search accepts Portuguese names without accents or exact casing', () => {
  assert.ok(categorySearchText('Papel Fotográfico').includes(categorySearchText(' FOTOGRAFICO ')))
  assert.ok(
    categorySearchText('Materiais de Escritório').includes(categorySearchText('escritorio'))
  )
})
