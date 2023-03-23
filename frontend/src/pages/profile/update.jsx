import Link from "next/link";
import BaseLayout from "../../components/shared/BaseLayout";

export default function UpdateProfile() {
  return (
    <BaseLayout>
      <h1 className="text-4xl font-bold text-slate-800 mb-8">Atualizar Perfil</h1>
      <form>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="cnpj">
            CNPJ
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="cnpj"
            type="text"
            placeholder="Digite o CNPJ"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="adress">
            Endereço
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="adress"
            type="text"
            placeholder="Digite o Endereço"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
            E-Mail
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Digite o E-Mail"
          />
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
        >
          Atualizar
        </button>
      </form>
      <hr className="mt-6 border border-gray-400"/>
      <div className="mt-8 text-center">
        <p className="text-gray-700">
          Não quer Atualizar o Perfil? <Link href="/profile" className="text-blue-600">Voltar para a Página de Perfil</Link>.
        </p>
      </div>
    </BaseLayout>
  )
}