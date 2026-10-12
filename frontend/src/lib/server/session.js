import { backendData, backendFetch } from './api'

const ACCESS_COOKIE = 'b2b_access'
const REFRESH_COOKIE = 'b2b_refresh'
function tokenPayload(token) {
  try {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString())
  } catch {
    return null
  }
}
function cookies(req) {
  return Object.fromEntries(
    (req.headers.cookie || '')
      .split(';')
      .filter(Boolean)
      .map((item) => {
        const separator = item.indexOf('=')
        return [item.slice(0, separator).trim(), item.slice(separator + 1)]
      })
  )
}
function cookie(name, value, maxAge, req) {
  const secure =
    req.headers['x-forwarded-proto'] === 'https' ||
    (process.env.NODE_ENV === 'production' &&
      !/^(localhost|127\.0\.0\.1)(:|$)/.test(req.headers.host || ''))
  return `${name}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure ? '; Secure' : ''}`
}
export function setSessionCookies(req, res, tokens) {
  const now = Math.floor(Date.now() / 1000)
  res.setHeader('Set-Cookie', [
    cookie(
      ACCESS_COOKIE,
      tokens.access,
      Math.max(0, (tokenPayload(tokens.access)?.exp || now) - now),
      req
    ),
    cookie(
      REFRESH_COOKIE,
      tokens.refresh,
      Math.max(0, (tokenPayload(tokens.refresh)?.exp || now) - now),
      req
    ),
  ])
}
export function clearSession(req, res) {
  res.setHeader('Set-Cookie', [
    cookie(ACCESS_COOKIE, '', 0, req),
    cookie(REFRESH_COOKIE, '', 0, req),
  ])
}
export async function getSession(req, res) {
  const stored = cookies(req)
  let access = stored[ACCESS_COOKIE]
  let payload = tokenPayload(access || '')
  if (!payload || payload.exp <= Date.now() / 1000 + 30) {
    if (!stored[REFRESH_COOKIE]) return null
    const response = await backendFetch('users/token/refresh/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: stored[REFRESH_COOKIE] }),
    })
    if (!response.ok) {
      if (response.status === 401) {
        clearSession(req, res)
        return null
      }
      throw new Error('Não foi possível verificar sua sessão.')
    }
    const tokens = await response.json()
    access = tokens.access
    payload = tokenPayload(access)
    setSessionCookies(req, res, { access, refresh: tokens.refresh || stored[REFRESH_COOKIE] })
  }
  try {
    return { user: await backendData(`users/${payload.user_id}/detail/`, access), access }
  } catch (error) {
    if (error.status === 401) {
      clearSession(req, res)
      return null
    }
    throw error
  }
}
export function sameOrigin(req) {
  if (req.headers['sec-fetch-site'] === 'cross-site') return false
  if (!req.headers.origin) return true
  try {
    return new URL(req.headers.origin).host === req.headers.host
  } catch {
    return false
  }
}
