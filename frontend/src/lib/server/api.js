import { apiUrl } from '../../config.js'

export async function backendFetch(path, options = {}) {
  return fetch(`${apiUrl}${path}`, {
    ...options,
    cache: 'no-store',
    signal: options.signal || AbortSignal.timeout(10000),
  })
}

export async function backendData(path, access) {
  const response = await backendFetch(path, {
    headers: access ? { Authorization: `Bearer ${access}` } : {},
  })
  if (!response.ok) {
    const error = new Error('Não foi possível carregar os dados. Tente novamente em instantes.')
    error.status = response.status
    throw error
  }
  return response.json()
}
