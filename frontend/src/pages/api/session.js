import { backendFetch, backendData } from '@/lib/server/api'
import { clearSession, getSession, sameOrigin, setSessionCookies } from '@/lib/server/session'

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store')
  if (!['GET', 'POST', 'DELETE'].includes(req.method)) {
    res.setHeader('Allow', 'GET, POST, DELETE')
    return res.status(405).json({ detail: 'Método não permitido.' })
  }
  if (req.method !== 'GET' && !sameOrigin(req))
    return res.status(403).json({ detail: 'Origem inválida.' })
  try {
    if (req.method === 'DELETE') {
      clearSession(req, res)
      res.status(204).end()
      return
    }
    if (req.method === 'GET') {
      const session = await getSession(req, res)
      return res.status(200).json({ user: session?.user || null })
    }
    const { username, password } = req.body || {}
    if (typeof username !== 'string' || typeof password !== 'string')
      return res.status(400).json({ detail: 'Informe usuário e senha.' })
    const response = await backendFetch('users/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    if (!response.ok)
      return res.status(response.status).json({ detail: 'Usuário ou senha inválidos.' })
    const tokens = await response.json()
    const payload = JSON.parse(Buffer.from(tokens.access.split('.')[1], 'base64url').toString())
    const user = await backendData(`users/${payload.user_id}/detail/`, tokens.access)
    setSessionCookies(req, res, tokens)
    return res.status(200).json({ user })
  } catch {
    return res.status(502).json({ detail: 'Não foi possível conectar à plataforma.' })
  }
}
