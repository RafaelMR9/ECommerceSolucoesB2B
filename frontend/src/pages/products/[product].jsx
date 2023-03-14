import Link from "next/link";
import Nav from '../../components/shared/Nav';
import Footer from '../../components/shared/Footer';

export default function Product() {
  return (
    <>
      <main className="bg-blue-50 min-h-screen">
        <Nav />
        <div className="container mx-auto px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <img
                className="object-contain h-60 lg:h-full w-full"
                src="https://dummyimage.com/600x400/000/fff"
                alt="Produto"
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-800 mb-2">Nome do Produto</h1>
              <hr className="border-gray-400 mb-4" />
              <div className="flex items-baseline mb-4">
                <p className="text-3xl text-green-600 font-bold mr-2">R$10.00</p>
                <p className="text-lg text-gray-500">por unidade</p>
              </div>
              <p className="text-lg text-gray-700 mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc lobortis sapien
                eget quam ultrices lobortis. Sed ac tellus quis tellus sodales tincidunt.
              </p>
              <div className="flex items-center mb-4">
                <p className="text-lg text-gray-700 font-bold mr-4">Unidades por Embalagem:</p>
                <p className="text-lg text-gray-700">1</p>
              </div>
              <div className="flex items-center mb-4">
                <p className="text-lg text-gray-700 font-bold mr-4">Categoria:</p>
                <Link href="#" className="text-lg text-blue-600">Categoria do Produto</Link>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline">
                Comprar
              </button>
            </div>
          </div>
        </div>
      <Footer />
    </main>
    </>
  )
}