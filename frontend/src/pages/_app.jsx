import '@/styles/globals.css'
import Head from 'next/head'
import localFont from 'next/font/local'
import { useRouter } from 'next/router'
import { AuthProvider } from '@/contexts/authContext'
import { NavigationProvider } from '@/contexts/navigationContext'
import BaseLayout from '@/components/shared/BaseLayout'
import EmptyState from '@/components/ui/EmptyState'
import Button from '@/components/ui/Button'

const manrope = localFont({
  src: '../assets/fonts/manrope-variable.ttf',
  variable: '--font-manrope',
  weight: '200 800',
  display: 'swap',
})
export default function App({ Component, pageProps }) {
  const router = useRouter()
  return (
    <div className={`${manrope.variable} ${manrope.className}`}>
      <Head>
        <title>B2B Soluções · Sua Empresa em Movimento</title>
        <meta
          name="description"
          content="Produtos, pedidos e atendimento para a rotina da sua empresa."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" sizes="16x16 32x32 48x48" />
      </Head>
      <AuthProvider
        initialUser={pageProps.initialUser}
        initialCartCount={pageProps.initialCartCount}
      >
        <NavigationProvider>
          {pageProps.serverError ? (
            <BaseLayout>
              <EmptyState
                heading="h1"
                title="A Plataforma Está Indisponível"
                description={pageProps.serverError}
                action={<Button onClick={() => window.location.reload()}>Tentar Novamente</Button>}
              />
            </BaseLayout>
          ) : (
            <Component key={router.asPath.split('#')[0]} {...pageProps} />
          )}
        </NavigationProvider>
      </AuthProvider>
    </div>
  )
}
