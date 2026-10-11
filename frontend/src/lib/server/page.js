import { getSession } from './session'
import { backendData } from './api'

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
      const data = await load({
        ...context,
        user: session.user,
        api: (path) => backendData(path, session.access),
      })
      if (data.notFound || data.redirect) return data
      return { props: { initialUser: session.user, ...data } }
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
