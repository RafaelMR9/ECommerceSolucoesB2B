export async function apiRequest(url, method = 'GET', data) {
  const multipart = typeof FormData !== 'undefined' && data instanceof FormData
  const options = { method }
  if (data !== undefined) {
    if (multipart) {
      options.body = data
    } else {
      options.body = JSON.stringify(data)
      options.headers = { 'Content-Type': 'application/json' }
    }
  }
  const response = await fetch(url, options)
  const result = response.status === 204 ? null : await response.json().catch(() => null)
  if (!response.ok) {
    const error = new Error(result?.detail || 'Não foi possível concluir a ação.')
    error.fields = result
    throw error
  }
  return result
}
