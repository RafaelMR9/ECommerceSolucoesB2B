import { getSession } from './session.js'
import { backendData } from './api.js'

export function withSession(load = async () => ({}), { admin = false, authPage = false } = {}) {
  return async (context) => {
    context.res.setHeader('Cache-Control', 'private, no-store')
    try {
      const session = await getSession(context.req, context.res)
      if (authPage) {
        if (session) return { redirect: { destination: '/', permanent: false } }
        const data = await load({ ...context, api: (path) => backendData(path) })
        return data.redirect || data.notFound ? data : { props: { initialUser: null, ...data } }
      }
      if (!session)
        return {
          redirect: {
            destination: `/authentication?next=${encodeURIComponent(context.resolvedUrl)}`,
            permanent: false,
          },
        }
      if (admin && !session.user.is_superuser)
        return { redirect: { destination: '/', permanent: false } }
      const requests = new Map()
      const api = (path) => {
        if (!requests.has(path)) requests.set(path, backendData(path, session.access))
        return requests.get(path)
      }
      const pageContext = {
        ...context,
        user: session.user,
        api,
      }
      const data = await load(pageContext)
      if (data.notFound || data.redirect) return data
      return {
        props: { initialUser: session.user, ...data, initialCartCount: session.user.cartCount },
      }
    } catch (error) {
      if (error.status === 404) return { notFound: true }
      context.res.statusCode = 503
      return {
        props: {
          serverError: 'Não foi possível conectar à plataforma. Tente novamente em instantes.',
        },
      }
    }
  }
}
