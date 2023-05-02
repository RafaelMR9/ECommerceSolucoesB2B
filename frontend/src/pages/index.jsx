import Link from 'next/link'
import Nav from '../components/shared/Nav'
import Footer from '../components/shared/Footer'
import ProtectedRoute from '@/components/routes/ProtectedRoute'

export default function Home() {

  return (
    <ProtectedRoute isProtected>
      <main className="bg-blue-50 min-h-screen">
        <Nav />
        <div className="container mx-auto px-8 py-8">
          <h1 className="text-4xl font-bold text-slate-800 text-center mb-8">
            Os Melhores Produtos a Venda para Todos os Tipos de Empresas
          </h1>
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Link href="/categoria1" className="bg-white rounded-full shadow-lg px-4 py-6 flex flex-col items-center justify-center border-4 border-white hover:bg-gray-100">
              <h2 className="text-xl font-bold mb-2">Categoria 1</h2>
              <p className="text-gray-700"><span className="font-semibold text-gray-600">Subcategoria:</span> Categoria X</p>
            </Link>
            <Link href="/categoria1" className="bg-white rounded-full shadow-lg px-4 py-6 flex flex-col items-center justify-center border-4 border-white hover:bg-gray-100">
              <h2 className="text-xl font-bold mb-2">Categoria 2</h2>
              <p className="text-gray-700"><span className="font-semibold text-gray-600">Subcategoria:</span> Categoria X</p>
            </Link>
            <Link href="/categoria1" className="bg-white rounded-full shadow-lg px-4 py-6 flex flex-col items-center justify-center border-4 border-white hover:bg-gray-100">
              <h2 className="text-xl font-bold mb-2">Categoria 3</h2>
              <p className="text-gray-700"><span className="font-semibold text-gray-600">Subcategoria:</span> Categoria X</p>
            </Link>
            <Link href="/categoria1" className="bg-white rounded-full shadow-lg px-4 py-6 flex flex-col items-center justify-center border-4 border-white hover:bg-gray-100">
              <h2 className="text-xl font-bold mb-2">Categoria 4</h2>
              <p className="text-gray-700"><span className="font-semibold text-gray-600">Subcategoria:</span> Categoria X</p>
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
                Categoria: <Link href="#" className="text-slate-800 hover:underline">Categoria do Produto</Link>
              </p>
              <p className="text-gray-800 font-bold text-xl mb-4">
                R$ 99,99
              </p>
              <Link href="#" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Mais Informações
              </Link>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-4">
              <img
                src="https://dummyimage.com/600x400/000/fff"
                alt="Imagem do produto"
                className="w-full rounded-lg mb-4"
              />
              <h2 className="text-xl font-bold mb-2">Produto 1</h2>
              <p className="text-gray-600 mb-4">
                Categoria: <Link href="#" className="text-slate-800 hover:underline">Categoria do Produto</Link>
              </p>
              <p className="text-gray-800 font-bold text-xl mb-4">
                R$ 99,99
              </p>
              <Link href="#" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Mais Informações
              </Link>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-4">
              <img
                src="https://dummyimage.com/600x400/000/fff"
                alt="Imagem do produto"
                className="w-full rounded-lg mb-4"
              />
              <h2 className="text-xl font-bold mb-2">Produto 1</h2>
              <p className="text-gray-600 mb-4">
                Categoria: <Link href="#" className="text-slate-800 hover:underline">Categoria do Produto</Link>
              </p>
              <p className="text-gray-800 font-bold text-xl mb-4">
                R$ 99,99
              </p>
              <Link href="#" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Mais Informações
              </Link>
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
              <p className="text-gray-600 mb-2">
                Categoria: <Link href="#" className="text-slate-800 hover:underline">Categoria do Produto</Link>
              </p>
              <div className="flex mb-4">
                <p className="text-green-600 font-bold text-xl">
                  R$ 99,99
                </p>
                <p className="text-gray-500 font-bold text-xl ml-2 line-through">
                  R$ 129,99
                </p>
              </div>
              <Link href="#" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Mais Informações
              </Link>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-4">
              <img
                src="https://dummyimage.com/600x400/000/fff"
                alt="Imagem do produto"
                className="w-full rounded-lg mb-4"
              />
              <h2 className="text-xl font-bold mb-2">Produto 1</h2>
              <p className="text-gray-600 mb-2">
                Categoria: <Link href="#" className="text-slate-800 hover:underline">Categoria do Produto</Link>
              </p>
              <div className="flex mb-4">
                <p className="text-green-600 font-bold text-xl">
                  R$ 99,99
                </p>
                <p className="text-gray-500 font-bold text-xl ml-2 line-through">
                  R$ 129,99
                </p>
              </div>
              <Link href="#" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Mais Informações
              </Link>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-4">
              <img
                src="https://dummyimage.com/600x400/000/fff"
                alt="Imagem do produto"
                className="w-full rounded-lg mb-4"
              />
              <h2 className="text-xl font-bold mb-2">Produto 1</h2>
              <p className="text-gray-600 mb-2">
                Categoria: <Link href="#" className="text-slate-800 hover:underline">Categoria do Produto</Link>
              </p>
              <div className="flex mb-4">
                <p className="text-green-600 font-bold text-xl">
                  R$ 99,99
                </p>
                <p className="text-gray-500 font-bold text-xl ml-2 line-through">
                  R$ 129,99
                </p>
              </div>
              <Link href="#" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Mais Informações
              </Link>
            </div>
          </section>
        </div>
        <div className="bg-blue-600 h-64">
          <h1 className="text-4xl font-bold text-white text-center mb-4 pt-9">
            Ficou com Alguma Dúvida?
          </h1>
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            Sem Problemas! Envie um Ticket Agora Para o Nosso Suporte.
          </h2>
          <div className="flex justify-center items-center">
            <Link href="/support" className="bg-white hover:bg-slate-100 text-xl text-blue-600 text-center font-bold py-6 px-20 rounded">
              Suporte
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    </ProtectedRoute>
  )
}