import '@/styles/globals.css'
import Head from 'next/head'
import { AuthProvider } from '../contexts/authContext';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Web Vendas</title>
        <meta name="description" content="Aplicação Web de Vendas" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </>
  )
}
