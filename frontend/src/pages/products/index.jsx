import Link from "next/link";
import Nav from "../../components/shared/Nav";
import Footer from "../../components/shared/Footer";

export default function Products() {
  return (
    <>
      <Nav />
      <main className="bg-blue-50 min-h-screen">
        <div className="container mx-auto px-8 py-8">
          <div className="flex justify-between mb-4">
            <h1 className="text-4xl font-bold text-slate-800">
              Produtos
            </h1>
            <Link href="/products/register-product" className="bg-white hover:bg-slate-100 border-2 border-blue-600 text-blue-600 flex items-center font-bold py-2 px-8 rounded focus:outline-none focus:shadow-outline">
              Cadastrar Produto
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Mais Informações
              </button>
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
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Mais Informações
              </button>
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
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Mais Informações
              </button>
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
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Mais Informações
              </button>
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
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Mais Informações
              </button>
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
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Mais Informações
              </button>
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
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Mais Informações
              </button>
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
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Mais Informações
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}