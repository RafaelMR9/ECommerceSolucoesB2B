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
export const money = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value) || 0)
export const date = (value, withTime = false) =>
  value
    ? new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        ...(withTime ? { timeStyle: 'short' } : {}),
        timeZone: 'America/Sao_Paulo',
      }).format(
        new Date(
          typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
            ? value + 'T12:00:00Z'
            : value
        )
      )
    : '—'
export function errorFields(error) {
  try {
    const data = JSON.parse(error.message)
    if (typeof data === 'object' && data)
      return Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          Array.isArray(value) ? value.join(' ') : String(value),
        ])
      )
  } catch {}
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
