export const categorySearchText = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .trim()

// Keep the hierarchy in presentation data; never change the category records.
export function categoryHierarchy(categories) {
  const ids = new Set(categories.map((category) => category.id))
  const children = new Map()
  for (const category of categories) {
    const siblings = children.get(category.category) || []
    siblings.push(category)
    children.set(category.category, siblings)
  }
  const visited = new Set()
  function visit(category) {
    visited.add(category.id)
    const descendants = []
    for (const child of children.get(category.id) || []) {
      if (!visited.has(child.id)) descendants.push(visit(child))
    }
    return { ...category, children: descendants }
  }
  const roots = categories.filter((category) => !ids.has(category.category))
  const tree = roots.map(visit)
  // Include orphaned or cyclic legacy records instead of silently hiding them.
  for (const category of categories) {
    if (!visited.has(category.id)) tree.push(visit(category))
  }
  return tree
}
