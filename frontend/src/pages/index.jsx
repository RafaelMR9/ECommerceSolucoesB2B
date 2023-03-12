import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link';

import { Inter } from 'next/font/google'
import { AuthContext } from '../contexts/authContext'
import Nav from '../components/shared/Nav'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  //const user = useContext(AuthContext);

  return (
    <>
      <Head>
        <title>Nome da loja</title>
        <meta name="description" content="Aplicação Web de Vendas" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-blue-50 min-h-screen">
        <Nav />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-slate-800 text-center mb-8">
            Os Melhores Produtos a Venda para Todos os Tipos de Empresas.
          </h1>
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Link href="/categoria1" className="bg-white rounded-full shadow-lg p-4 flex flex-col items-center justify-center">
              <h2 className="text-xl font-bold mb-2">Categoria 1</h2>
              <img src="https://dummyimage.com/150x150/000/fff" alt="Categoria 1" className="w-16 h-16 mb-2" />
              <p className="text-gray-600">Descrição breve da categoria</p>
            </Link>
            <Link href="/categoria2" className="bg-white rounded-full shadow-lg p-4 flex flex-col items-center justify-center">
              <h2 className="text-xl font-bold mb-2">Categoria 2</h2>
              <img src="https://dummyimage.com/150x150/000/fff" alt="Categoria 2" className="w-16 h-16 mb-2" />
              <p className="text-gray-600">Descrição breve da categoria</p>
            </Link>
            <Link href="/categoria3" className="bg-white rounded-full shadow-lg p-4 flex flex-col items-center justify-center">
              <h2 className="text-xl font-bold mb-2">Categoria 3</h2>
              <img src="https://dummyimage.com/150x150/000/fff" alt="Categoria 3" className="w-16 h-16 mb-2" />
              <p className="text-gray-600">Descrição breve da categoria</p>
            </Link>
            <Link href="/categoria4" className="bg-white rounded-full shadow-lg p-4 flex flex-col items-center justify-center">
              <h2 className="text-xl font-bold mb-2">Categoria 4</h2>
              <img src="https://dummyimage.com/150x150/000/fff" alt="Categoria 4" className="w-16 h-16 mb-2" />
              <p className="text-gray-600">Descrição breve da categoria</p>
            </Link>
          </section>
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Produtos em Destaque
          </h1>
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <img
                src="https://dummyimage.com/600x400/000/fff"
                alt="Imagem do produto"
                className="w-full rounded-lg mb-4"
              />
              <h2 className="text-xl font-bold mb-2">Produto 1</h2>
              <p className="text-gray-600 mb-4">
                Descrição breve do produto. Lorem ipsum dolor sit amet,
                consectetur adipiscing elit. Vivamus vestibulum ipsum et orci
                mattis feugiat. Praesent auctor, erat a suscipit commodo.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Comprar
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-4">
              <img
                src="https://dummyimage.com/600x400/000/fff"
                alt="Imagem do produto"
                className="w-full rounded-lg mb-4"
              />
              <h2 className="text-xl font-bold mb-2">Produto 2</h2>
              <p className="text-gray-600 mb-4">
                Descrição breve do produto. Lorem ipsum dolor sit amet,
                consectetur adipiscing elit. Vivamus vestibulum ipsum et orci
                mattis feugiat. Praesent auctor, erat a suscipit commodo.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Comprar
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-4">
              <img
                src="https://dummyimage.com/600x400/000/fff"
                alt="Imagem do produto"
                className="w-full rounded-lg mb-4"
              />
              <h2 className="text-xl font-bold mb-2">Produto 3</h2>
              <p className="text-gray-600 mb-4">
                Descrição breve do produto. Lorem ipsum dolor sit amet,
                consectetur adipiscing elit. Vivamus vestibulum ipsum et orci
                mattis feugiat. Praesent auctor, erat a suscipit commodo.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Comprar
              </button>
            </div>
          </section>
          <h1 className="text-4xl font-bold text-slate-800 mt-8 mb-4">
            Algumas de Nossas Promoções
          </h1>
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <img
                src="https://dummyimage.com/600x400/000/fff"
                alt="Imagem do produto"
                className="w-full rounded-lg mb-4"
              />
              <h2 className="text-xl font-bold mb-2">Produto 1</h2>
              <p className="text-gray-600 mb-4">
                Descrição breve do produto. Lorem ipsum dolor sit amet,
                consectetur adipiscing elit. Vivamus vestibulum ipsum et orci
                mattis feugiat. Praesent auctor, erat a suscipit commodo.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Comprar
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-4">
              <img
                src="https://dummyimage.com/600x400/000/fff"
                alt="Imagem do produto"
                className="w-full rounded-lg mb-4"
              />
              <h2 className="text-xl font-bold mb-2">Produto 2</h2>
              <p className="text-gray-600 mb-4">
                Descrição breve do produto. Lorem ipsum dolor sit amet,
                consectetur adipiscing elit. Vivamus vestibulum ipsum et orci
                mattis feugiat. Praesent auctor, erat a suscipit commodo.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Comprar
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-4">
              <img
                src="https://dummyimage.com/600x400/000/fff"
                alt="Imagem do produto"
                className="w-full rounded-lg mb-4"
              />
              <h2 className="text-xl font-bold mb-2">Produto 3</h2>
              <p className="text-gray-600 mb-4">
                Descrição breve do produto. Lorem ipsum dolor sit amet,
                consectetur adipiscing elit. Vivamus vestibulum ipsum et orci
                mattis feugiat. Praesent auctor, erat a suscipit commodo.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Comprar
              </button>
            </div>
          </section>
        </div>
        <div className="bg-blue-600 h-64">
          <h1 className="text-4xl font-bold text-white text-center mb-4 pt-9">
            Ficou com Alguma Dúvida?
          </h1>
          <h2 className="text-2xl font-bold text-white text-center mb-4">
            Sem Problemas! Envie um Ticket Agora Para o Nosso Suporte.
          </h2>
          <div className="flex justify-center items-center">
            <Link href="/suport" className="bg-white hover:bg-slate-100 text-xl text-blue-600 text-center font-bold py-6 px-20 rounded">
              Suporte
            </Link>
          </div>
          
        </div>
        <footer className="bg-slate-800 text-white py-4">
          <div className="container mx-auto px-4">
            <p className="text-center">
              © 2023 - Desenvolvido por Rafael
            </p>
          </div>
        </footer>
      </main>
    </>
  )
}