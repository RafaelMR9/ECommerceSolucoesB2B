import Link from "next/link";
import BaseLayout from "../../components/shared/BaseLayout";

export default function RegisterPromotion() {
  return (
    <BaseLayout>
      <h1 className="text-4xl font-bold text-slate-800 mb-8">Registrar Promoção</h1>
      <form>
        <div className="mb-4">
          <label htmlFor="startDate" className="block text-base font-medium text-gray-700 mb-2">Data Inicial</label>
          <input type="date" id="startDate" name="startDate" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div className="mb-4">
          <label htmlFor="endDate" className="block text-base font-medium text-gray-700 mb-2">Data Final</label>
          <input type="date" id="endDate" name="endDate" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div className="mb-4">
          <label htmlFor="price" className="block text-base font-medium text-gray-700 mb-2">Preço de Venda</label>
          <input type="number" id="price" name="price" step="0.01" min="0" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <button type="submit" className="inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600">
          Registrar
        </button>
      </form>
      <hr className="mt-6 border border-gray-400" />
      <div className="mt-8 text-center">
        <p className="text-gray-700">
          Não quer Cadastrar a Promoção? <Link href="/products/1" className="text-blue-600">Voltar para a Página do Produto</Link>.
        </p>
      </div>
    </BaseLayout>
  )
}