import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { navigationLoading } from '@/lib/navigation'

const NavigationContext = createContext(null)

export function useNavigationLoading() {
  return useContext(NavigationContext)
}

export function NavigationProvider({ children }) {
  const router = useRouter()
  const [pending, setPending] = useState(null)

  useEffect(() => {
    function start(url) {
      const type = navigationLoading(router.asPath, url)
      setPending(type ? { url, type } : null)
    }
    function finish(url) {
      setPending((current) => (current?.url === url ? null : current))
    }
    function fail(error, url) {
      finish(url)
    }
    router.events.on('routeChangeStart', start)
    router.events.on('routeChangeComplete', finish)
    router.events.on('routeChangeError', fail)
    return () => {
      router.events.off('routeChangeStart', start)
      router.events.off('routeChangeComplete', finish)
      router.events.off('routeChangeError', fail)
    }
  }, [router])

  return (
    <NavigationContext.Provider value={pending?.type || null}>
      {children}
      {pending?.type === 'page' && (
        <div
          className="pointer-events-none fixed inset-x-0 top-0 z-300 h-1.25 overflow-hidden bg-brand-accent/20"
          role="status"
          aria-live="polite"
        >
          <div className="h-full w-2/5 animate-navigation rounded-full bg-brand-accent shadow-[0_0_8px_#7c3aed80] motion-reduce:w-full motion-reduce:animate-none" />
          <span className="sr-only">Carregando página…</span>
        </div>
      )}
    </NavigationContext.Provider>
  )
}
