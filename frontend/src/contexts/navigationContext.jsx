import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Spinner from '@/components/ui/Spinner'
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
          className="pointer-events-none fixed right-6 bottom-[calc(1.5rem+env(safe-area-inset-bottom))] z-50 grid size-11 place-items-center rounded-full border border-brand-border bg-white shadow-panel text-brand-accent"
          role="status"
          aria-live="polite"
        >
          <Spinner className="size-6" />
          <span className="sr-only">Carregando página…</span>
        </div>
      )}
    </NavigationContext.Provider>
  )
}
