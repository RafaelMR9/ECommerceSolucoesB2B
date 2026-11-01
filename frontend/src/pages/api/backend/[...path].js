import { backendFetch } from '@/lib/server/api'
import { getAccessToken, refreshAccessToken, clearSession, sameOrigin } from '@/lib/server/session'

export const config = { api: { bodyParser: false } }
const MAX_REQUEST_BYTES = 5 * 1024 * 1024
const PATHS_WITHOUT_TRAILING_SLASH = new Set([
  'users/admin_id',
  'users/user_id',
  'products/filterName',
  'products/filterCategory',
  'products/categories/filter',
  'suppliers/filter',
  'carriers/filter',
])

async function forwardRequest(req, res, path, access) {
  const headers = {}
  if (access) headers.Authorization = `Bearer ${access}`
  if (req.headers['content-type']) headers['Content-Type'] = req.headers['content-type']

  let body
  if (req.method !== 'GET') {
    const chunks = []
    let bytes = 0
    for await (const chunk of req) {
      bytes += chunk.length
      if (bytes > MAX_REQUEST_BYTES)
        return res.status(413).json({ detail: 'Os dados enviados excedem o tamanho permitido.' })
      chunks.push(chunk)
    }
    body = Buffer.concat(chunks, bytes)
  }

  let response = await backendFetch(path, { method: req.method, headers, body })
  if (access && response.status === 401 && req.cookies.b2b_access) {
    await response.body?.cancel()
    const renewedAccess = await refreshAccessToken(req, res)
    if (!renewedAccess)
      return res.status(401).json({ detail: 'Entre na sua conta para continuar.' })
    headers.Authorization = `Bearer ${renewedAccess}`
    response = await backendFetch(path, { method: req.method, headers, body })
  }
  if (access && response.status === 401) clearSession(req, res)
  if (response.status === 204) {
    res.status(204).end()
    return
  }
  const type = response.headers.get('content-type')
  if (type) res.setHeader('Content-Type', type)
  return res.status(response.status).send(Buffer.from(await response.arrayBuffer()))
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store')
  const { path: segments, ...queryParameters } = req.query
  if (
    !Array.isArray(segments) ||
    !['users', 'products', 'marketing', 'orders', 'suppliers', 'carriers', 'support'].includes(
      segments[0]
    ) ||
    segments.some((part) => part === '.' || part === '..')
  )
    return res.status(404).json({ detail: 'Recurso não encontrado.' })
  if (!['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    res.status(405).end()
    return
  }
  if (req.method !== 'GET' && !sameOrigin(req))
    return res.status(403).json({ detail: 'Origem inválida.' })
  const pathname = segments.map(encodeURIComponent).join('/')
  const publicAuth = segments[0] === 'users' && ['register', 'passwordReset'].includes(segments[1])
  try {
    const access = publicAuth ? null : await getAccessToken(req, res)
    if (!publicAuth && !access)
      return res.status(401).json({ detail: 'Entre na sua conta para continuar.' })
    const query = new URLSearchParams(queryParameters)
    const slash = PATHS_WITHOUT_TRAILING_SLASH.has(pathname) ? '' : '/'
    const path = `${pathname}${slash}${query.size ? `?${query}` : ''}`
    await forwardRequest(req, res, path, access)
  } catch {
    return res.status(502).json({ detail: 'Não foi possível conectar à plataforma.' })
  }
}
