import '@/styles/globals.css'
import Head from 'next/head'
import localFont from 'next/font/local'
import { AuthProvider } from '@/contexts/authContext'
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
  return (
    <div className={`${manrope.variable} ${manrope.className}`}>
      <Head>
        <title>B2B Soluções · Sua Empresa em Movimento</title>
        <meta
          name="description"
          content="Produtos, pedidos e atendimento para a rotina da sua empresa."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AuthProvider
        initialUser={pageProps.initialUser}
        initialCartCount={pageProps.initialCartCount}
      >
        {pageProps.serverError ? (
          <BaseLayout>
            <EmptyState
              title="A Plataforma Está Indisponível"
              description={pageProps.serverError}
              action={<Button onClick={() => window.location.reload()}>Tentar Novamente</Button>}
            />
          </BaseLayout>
        ) : (
          <Component {...pageProps} />
        )}
      </AuthProvider>
    </div>
  )
}
