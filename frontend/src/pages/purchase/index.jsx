import Link from "next/link";
import BaseLayout from "../../components/shared/BaseLayout";

export default function Purchase() {
  return (
    <BaseLayout>
      <h1 className="text-4xl font-bold text-slate-800 mb-8">
        Comprar - (Nome do Produto)
      </h1>
      <form>
        <div className="mb-4">
          <label htmlFor="quantity" className="block text-base font-medium text-gray-700 mb-2">Quantidade</label>
          <input type="number" id="quantity" name="quantity" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div className="mt-6 flex items-center justify-around">
          <button type="submit" className="px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600">
            Comprar
          </button>
          <button type="submit" className="px-6 py-3 border-2 rounded-md shadow-sm text-base font-medium hover:bg-white border-blue-600 text-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600">
            Adicionar ao Carrinho
          </button>
        </div>
      </form>
      <hr className="mt-6 border border-gray-400" />
      <div className="mt-8 text-center">
        <p className="text-gray-700">
          Não quer Adiquirir o Produto? <Link href="/categories" className="text-blue-600">Voltar para a Página do Produto</Link>.
        </p>
      </div>
    </BaseLayout>
  )
}