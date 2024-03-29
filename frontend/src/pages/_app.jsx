import '@/styles/globals.css'
import Head from 'next/head'
import { AuthProvider } from '../contexts/authContext';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>B2B Soluções</title>
        <meta name="description" content="Aplicação Web de Vendas" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="Content-Language" content="pt-br" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </>
  )
}
