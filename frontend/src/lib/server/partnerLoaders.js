import { normalizeSearch } from '../format.js'

export async function loadPartners({ api, query }, kind) {
  const term = query.search ?? query.fetchSuppliers ?? query.fetchCarriers
  const search = typeof term === 'string' ? term : ''
  const all = await api(`${kind}/`)
  const normalized = normalizeSearch(search)
  return {
    partners: all.filter((partner) => normalizeSearch(partner.name).includes(normalized)),
    search,
  }
}
