import Link from "next/link";
import BaseLayout from "../../components/shared/BaseLayout";

export default function SendTicket() {
  return (
    <BaseLayout>
      <h1 className="text-4xl font-bold text-slate-800 mb-8">Abrir Ticket</h1>
      <form>
        <div className="mb-4">
          <label htmlFor="subject" className="block text-base font-medium text-gray-700 mb-2">Assunto</label>
          <input type="text" id="subject" name="subject" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block text-base font-medium text-gray-700 mb-2">Conteúdo</label>
          <textarea
            rows={6}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="content"
          ></textarea>
        </div>
        <button type="submit" className="inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600">
          Enviar
        </button>
      </form>
      <hr className="mt-6 border border-gray-400" />
      <div className="mt-8 text-center">
        <p className="text-gray-700">
          Não precisa Enviar um Ticket ao nosso suporte? <Link href="/support" className="text-blue-600">Voltar para a Página de Suporte</Link>.
        </p>
      </div>
    </BaseLayout>
  )
}