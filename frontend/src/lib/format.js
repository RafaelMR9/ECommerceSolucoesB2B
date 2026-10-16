export const normalizeSearch = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .trim()

const titleConnectors = new Set(
  'a o as os e ou de do da dos das em no na nos nas para por pelo pela pelos pelas ao aos à às com sem sob sobre até entre ante após contra desde perante como um uma uns umas'.split(
    ' '
  )
)
export function titleCase(value) {
  return String(value).replace(/[\p{L}\p{N}]+/gu, (word, offset) => {
    const lower = word.toLocaleLowerCase('pt-BR')
    return offset > 0 && titleConnectors.has(lower)
      ? lower
      : word.charAt(0).toLocaleUpperCase('pt-BR') + word.slice(1)
  })
}
const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeZone: 'America/Sao_Paulo',
})
const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'America/Sao_Paulo',
})
export const money = (value) => currencyFormatter.format(Number(value) || 0)
export function date(value, withTime = false) {
  if (!value) return '—'
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    value += 'T12:00:00Z'
  }
  const formatter = withTime ? dateTimeFormatter : dateFormatter
  return formatter.format(new Date(value))
}
export function errorFields(error) {
  if (error.fields && typeof error.fields === 'object') {
    const messages = {}
    for (const [name, value] of Object.entries(error.fields)) {
      messages[name] = Array.isArray(value) ? value.join(' ') : String(value)
    }
    return messages
  }
  return { detail: error.message || 'Não foi possível concluir a ação.' }
}
export function activePromotion(product, promotions, now) {
  return promotions.find(
    (p) =>
      p.product === product.id &&
      new Date(p.startDate).getTime() <= now &&
      new Date(p.endDate).getTime() >= now
  )
}
