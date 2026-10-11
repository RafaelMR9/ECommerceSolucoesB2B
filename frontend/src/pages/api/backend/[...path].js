import { backendFetch } from '@/lib/server/api'
import { getSession, sameOrigin } from '@/lib/server/session'

export const config = { api: { bodyParser: false, responseLimit: '4mb' } }
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store')
  const segments = req.query.path
  if (
    !Array.isArray(segments) ||
    !['users', 'products', 'marketing', 'orders', 'suppliers', 'carriers', 'support'].includes(
      segments[0]
    ) ||
    segments.some((part) => part === '.' || part === '..')
  )
    return res.status(404).json({ detail: 'Recurso não encontrado.' })
  if (!['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) return res.status(405).end()
  if (req.method !== 'GET' && !sameOrigin(req))
    return res.status(403).json({ detail: 'Origem inválida.' })
  const pathname = segments.map(encodeURIComponent).join('/')
  const publicAuth = /^users\/(register|passwordReset)(\/|$)/.test(pathname)
  try {
    const session = publicAuth ? null : await getSession(req, res)
    if (!publicAuth && !session)
      return res.status(401).json({ detail: 'Entre na sua conta para continuar.' })
    const query = new URLSearchParams()
    Object.entries(req.query).forEach(([key, value]) => {
      if (key !== 'path') query.set(key, String(value))
    })
    const noSlash =
      /^(users\/(admin_id|user_id)|products\/(filterName|filterCategory)|products\/categories\/filter|suppliers\/filter|carriers\/filter)$/.test(
        pathname
      )
    const path = `${pathname}${noSlash ? '' : '/'}${query.size ? `?${query}` : ''}`
    const headers = {}
    if (session) headers.Authorization = `Bearer ${session.access}`
    if (req.headers['content-type']) headers['Content-Type'] = req.headers['content-type']
    let body
    if (req.method !== 'GET') {
      const chunks = []
      let bytes = 0
      for await (const chunk of req) {
        bytes += chunk.length
        if (bytes > 4 * 1024 * 1024)
          return res.status(413).json({ image: ['A imagem deve ter até 4 MB.'] })
        chunks.push(chunk)
      }
      body = Buffer.concat(chunks)
    }
    const response = await backendFetch(path, { method: req.method, headers, body })
    if (response.status === 204) return res.status(204).end()
    const type = response.headers.get('content-type')
    if (type) res.setHeader('Content-Type', type)
    return res.status(response.status).send(Buffer.from(await response.arrayBuffer()))
  } catch {
    return res.status(502).json({ detail: 'Não foi possível conectar à plataforma.' })
  }
}
