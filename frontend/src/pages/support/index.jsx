import Link from "next/link";
import BaseLayout from "../../components/shared/BaseLayout";

export default function Support() {
  const tickets = [
    {
      id: 1,
      subject: 'Problema com o pagamento',
      content: 'Olá, realizei a compra do produto X e meu cartão foi debitado, mas não recebi nenhuma confirmação de pagamento. Aguardo retorno.',
      date: '02-12-2023'
    },
    {
      id: 2,
      subject: 'Produto não entregue',
      content: 'Comprei o produto Y há 1 mês e até o momento não recebi. O rastreio diz que está em trânsito, mas já ultrapassou o prazo de entrega. Por favor, verifiquem o que está acontecendo.',
      date: '02-10-2023'
    },
    {
      id: 3,
      subject: 'Troca de produto',
      content: 'Recebi o produto Z com defeito e gostaria de solicitar a troca. Por favor, me informem o procedimento.',
      date: '02-05-2023'
    }
  ]

  return (
    <BaseLayout>
      <div className="flex justify-between mb-8">
        <h1 className="text-4xl font-bold text-slate-800">Meus Tickets</h1>
        <Link href="/support/send-ticket" className="hover:bg-white border-2 border-blue-600 text-blue-600 flex items-center font-bold py-2 px-8 rounded focus:outline-none focus:shadow-outline">
          Enviar Ticket
        </Link>
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        {tickets.map(ticket => (
          <div key={ticket.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">{ticket.subject}</h2>
              <p className="text-sm text-gray-700 mb-3">{ticket.content.slice(0, 50)}...</p>
              <p className="text-sm text-gray-600">{ticket.date}</p>
            </div>
          </div>
        ))}
      </div>
    </BaseLayout>
  )
}