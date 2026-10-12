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
  for (const category of categories) {
    if (!visited.has(category.id)) tree.push(visit(category))
  }
  return tree
}
