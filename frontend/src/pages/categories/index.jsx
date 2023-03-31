import Link from "next/link";
import BaseLayout from "../../components/shared/BaseLayout";

export default function Categories() {
  return (
    <BaseLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold text-slate-800">Categorias</h1>
        <div className="flex-shrink-0 flex-grow">
          <form className="flex px-20">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Buscar Categoria"
            />
            <button className="ml-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
              Pesquisar
            </button>
          </form>
        </div>
        <Link href="/categories/register" className="hover:bg-white border-2 border-blue-600 text-blue-600 flex items-center font-bold py-2 px-8 rounded focus:outline-none focus:shadow-outline">
          Cadastrar Categoria
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link href="/categoria1" className="bg-white rounded-full shadow-lg px-4 py-6 flex flex-col items-center justify-center border-4 border-white hover:bg-gray-100">
          <h2 className="text-xl font-bold mb-2">Categoria</h2>
          <p className="text-gray-700"><span className="font-semibold text-gray-600">Subcategoria:</span> Categoria X</p>
        </Link>
        <Link href="/categoria1" className="bg-white rounded-full shadow-lg px-4 py-6 flex flex-col items-center justify-center border-4 border-white hover:bg-gray-100">
          <h2 className="text-xl font-bold mb-2">Categoria</h2>
          <p className="text-gray-700"><span className="font-semibold text-gray-600">Subcategoria:</span> Categoria X</p>
        </Link>
        <Link href="/categoria1" className="bg-white rounded-full shadow-lg px-4 py-6 flex flex-col items-center justify-center border-4 border-white hover:bg-gray-100">
          <h2 className="text-xl font-bold mb-2">Categoria</h2>
          <p className="text-gray-700"><span className="font-semibold text-gray-600">Subcategoria:</span> Categoria X</p>
        </Link>
        <Link href="/categoria1" className="bg-white rounded-full shadow-lg px-4 py-6 flex flex-col items-center justify-center border-4 border-white hover:bg-gray-100">
          <h2 className="text-xl font-bold mb-2">Categoria</h2>
          <p className="text-gray-700"><span className="font-semibold text-gray-600">Subcategoria:</span> Categoria X</p>
        </Link>
        <Link href="/categoria1" className="bg-white rounded-full shadow-lg px-4 py-6 flex flex-col items-center justify-center border-4 border-white hover:bg-gray-100">
          <h2 className="text-xl font-bold mb-2">Categoria</h2>
          <p className="text-gray-700"><span className="font-semibold text-gray-600">Subcategoria:</span> Categoria X</p>
        </Link>
        <Link href="/categoria1" className="bg-white rounded-full shadow-lg px-4 py-6 flex flex-col items-center justify-center border-4 border-white hover:bg-gray-100">
          <h2 className="text-xl font-bold mb-2">Categoria</h2>
          <p className="text-gray-700"><span className="font-semibold text-gray-600">Subcategoria:</span> Categoria X</p>
        </Link>
        <Link href="/categoria1" className="bg-white rounded-full shadow-lg px-4 py-6 flex flex-col items-center justify-center border-4 border-white hover:bg-gray-100">
          <h2 className="text-xl font-bold mb-2">Categoria</h2>
          <p className="text-gray-700"><span className="font-semibold text-gray-600">Subcategoria:</span> Categoria X</p>
        </Link>
        <Link href="/categoria1" className="bg-white rounded-full shadow-lg px-4 py-6 flex flex-col items-center justify-center border-4 border-white hover:bg-gray-100">
          <h2 className="text-xl font-bold mb-2">Categoria</h2>
          <p className="text-gray-700"><span className="font-semibold text-gray-600">Subcategoria:</span> Categoria X</p>
        </Link>
        <Link href="/categoria1" className="bg-white rounded-full shadow-lg px-4 py-6 flex flex-col items-center justify-center border-4 border-white hover:bg-gray-100">
          <h2 className="text-xl font-bold mb-2">Categoria</h2>
          <p className="text-gray-700"><span className="font-semibold text-gray-600">Subcategoria:</span> Categoria X</p>
        </Link>
        <Link href="/categoria1" className="bg-white rounded-full shadow-lg px-4 py-6 flex flex-col items-center justify-center border-4 border-white hover:bg-gray-100">
          <h2 className="text-xl font-bold mb-2">Categoria</h2>
          <p className="text-gray-700"><span className="font-semibold text-gray-600">Subcategoria:</span> Categoria X</p>
        </Link>
        <Link href="/categoria1" className="bg-white rounded-full shadow-lg px-4 py-6 flex flex-col items-center justify-center border-4 border-white hover:bg-gray-100">
          <h2 className="text-xl font-bold mb-2">Categoria</h2>
          <p className="text-gray-700"><span className="font-semibold text-gray-600">Subcategoria:</span> Categoria X</p>
        </Link>
        <Link href="/categoria1" className="bg-white rounded-full shadow-lg px-4 py-6 flex flex-col items-center justify-center border-4 border-white hover:bg-gray-100">
          <h2 className="text-xl font-bold mb-2">Categoria</h2>
          <p className="text-gray-700"><span className="font-semibold text-gray-600">Subcategoria:</span> Categoria X</p>
        </Link>
        <Link href="/categoria1" className="bg-white rounded-full shadow-lg px-4 py-6 flex flex-col items-center justify-center border-4 border-white hover:bg-gray-100">
          <h2 className="text-xl font-bold mb-2">Categoria</h2>
          <p className="text-gray-700"><span className="font-semibold text-gray-600">Subcategoria:</span> Categoria X</p>
        </Link>
        <Link href="/categoria1" className="bg-white rounded-full shadow-lg px-4 py-6 flex flex-col items-center justify-center border-4 border-white hover:bg-gray-100">
          <h2 className="text-xl font-bold mb-2">Categoria</h2>
          <p className="text-gray-700"><span className="font-semibold text-gray-600">Subcategoria:</span> Categoria X</p>
        </Link>
        <Link href="/categoria1" className="bg-white rounded-full shadow-lg px-4 py-6 flex flex-col items-center justify-center border-4 border-white hover:bg-gray-100">
          <h2 className="text-xl font-bold mb-2">Categoria</h2>
          <p className="text-gray-700"><span className="font-semibold text-gray-600">Subcategoria:</span> Categoria X</p>
        </Link>
      </div>
    </BaseLayout>
  )
}