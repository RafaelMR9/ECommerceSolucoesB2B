import Link from "next/link";
import BaseLayout from "../../components/shared/BaseLayout";

export default function AnswerTicket() {
  return (
    <BaseLayout>
      <h1 className="text-4xl font-bold text-slate-800 mb-8">Responder Ticket</h1>
      <form>
        <div className="mb-4">
          <label htmlFor="message" className="block text-base font-medium text-gray-700 mb-2">Mensagem</label>
          <textarea
            rows={9}
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="message"
          ></textarea>
        </div>
        <button type="submit" className="inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600">
          Responder
        </button>
      </form>
      <hr className="mt-6 border border-gray-400" />
      <div className="mt-8 text-center">
        <p className="text-gray-700">
          Não Quer Responder ou Resolvemos sua Questão? <Link href="/support/1" className="text-blue-600">Voltar para a Página do Ticket</Link>.
        </p>
      </div>
    </BaseLayout>
  )
}