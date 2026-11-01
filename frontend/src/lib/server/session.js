import { stringifySetCookie } from 'cookie'
import { backendData, backendFetch } from './api.js'

const ACCESS_COOKIE = 'b2b_access'
const REFRESH_COOKIE = 'b2b_refresh'
function cookie(name, value, maxAge, req) {
  const hostname = (req.headers.host || '').split(':')[0]
  const local = hostname === 'localhost' || hostname === '127.0.0.1'
  const secure =
    req.headers['x-forwarded-proto'] === 'https' ||
    (process.env.NODE_ENV === 'production' && !local)
  return stringifySetCookie({
    name,
    value,
    maxAge,
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure,
  })
}
export function setSessionCookies(req, res, tokens) {
  const cookies = [cookie(ACCESS_COOKIE, tokens.access, tokens.access_max_age, req)]
  if (tokens.refresh) {
    cookies.push(cookie(REFRESH_COOKIE, tokens.refresh, tokens.refresh_max_age, req))
  }
  res.setHeader('Set-Cookie', cookies)
}
export function clearSession(req, res) {
  res.setHeader('Set-Cookie', [
    cookie(ACCESS_COOKIE, '', 0, req),
    cookie(REFRESH_COOKIE, '', 0, req),
  ])
}
async function authenticatedUser(access) {
  try {
    return await backendData('users/me/', access)
  } catch (error) {
    if (error.status === 401) return null
    throw error
  }
}
export async function refreshAccessToken(req, res) {
  const refresh = req.cookies[REFRESH_COOKIE]
  if (!refresh) {
    if (req.cookies[ACCESS_COOKIE]) clearSession(req, res)
    return null
  }
  const response = await backendFetch('users/token/refresh/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  })
  if (response.status === 401) {
    clearSession(req, res)
    return null
  }
  if (!response.ok) throw new Error('Não foi possível verificar sua sessão.')
  const tokens = await response.json()
  setSessionCookies(req, res, tokens)
  return tokens.access
}
export async function getAccessToken(req, res) {
  return req.cookies[ACCESS_COOKIE] || refreshAccessToken(req, res)
}
export async function getSession(req, res) {
  const access = req.cookies[ACCESS_COOKIE]
  if (access) {
    const user = await authenticatedUser(access)
    if (user) return { user, access }
  }
  const renewedAccess = await refreshAccessToken(req, res)
  if (!renewedAccess) return null
  const user = await authenticatedUser(renewedAccess)
  if (!user) {
    clearSession(req, res)
    return null
  }
  return { user, access: renewedAccess }
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
