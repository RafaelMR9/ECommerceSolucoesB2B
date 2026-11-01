const filterPages = new Set(['/products', '/categories', '/suppliers', '/carriers'])

export function navigationLoading(from, to) {
  const current = new URL(from, 'http://localhost')
  const next = new URL(to, 'http://localhost')
  if (current.origin !== next.origin) return null
  if (current.pathname !== next.pathname) return 'page'
  if (current.search === next.search) return null
  if (filterPages.has(current.pathname)) return 'results'
  return 'page'
}
