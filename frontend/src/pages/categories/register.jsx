import Link from "next/link";
import BaseLayout from "../../components/shared/BaseLayout";

export default function RegisterCategory() {
  return (
    <BaseLayout>
      <h1 className="text-4xl font-bold text-slate-800 mb-8">Cadastrar Categoria</h1>
      <form>
        <div className="mb-4">
          <label htmlFor="name" className="block text-base font-medium text-gray-700 mb-2">Nome</label>
          <input type="text" id="name" name="name" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block text-base font-medium text-gray-700 mb-2">Categoria Pai</label>
          <select id="category" name="category" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option value="">Selecione uma Sub-Categoria (Opcional)</option>
            <option value="categoria1">Categoria 1</option>
            <option value="categoria2">Categoria 2</option>
            <option value="categoria3">Categoria 3</option>
          </select>
        </div>
        <button type="submit" className="inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600">
          Cadastrar
        </button>
      </form>
      <hr className="mt-6 border border-gray-400" />
      <div className="mt-8 text-center">
        <p className="text-gray-700">
          Não quer Cadastrar a Categoria? <Link href="/categories" className="text-blue-600">Voltar para a Página de Categorias</Link>.
        </p>
      </div>
    </BaseLayout>
  )
}