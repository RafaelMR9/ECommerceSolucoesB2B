import Link from "next/link";
import BaseLayout from "../../components/shared/BaseLayout";
import { useState } from "react";

export default function AnswerTicket() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "user",
      message: "Olá, estou tendo problemas para acessar minha conta.",
    },
    {
      id: 2,
      sender: "admin",
      message: "Olá, em que posso ajudá-lo?",
    },
    {
      id: 3,
      sender: "user",
      message: "Não consigo fazer login, aparece uma mensagem de erro.",
    },
    {
      id: 4,
      sender: "admin",
      message: "Por favor, me informe qual é a mensagem de erro que aparece.",
    },
  ])

  const handleSendMessage = (e) => {
    e.preventDefault();
    const message = e.target.message.value;
    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        sender: "user",
        message,
      },
    ])
    e.target.reset();
  }

  return (
    <BaseLayout>
      <h1 className="text-4xl font-bold text-slate-800 mb-8">Conversa Suporte</h1>
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Problemas para acessar a conta
          </h3>
          <p className="mt-1 max-w-2xl text-md text-gray-500">
            Criado em 20 de Fevereiro de 2023
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 ${message.sender === "user" ? "bg-gray-100" : ""
                  }`}
              >
                <dt className="text-md font-medium text-gray-700">
                  {message.sender === "user" ? "Você" : "Administrador"}
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {message.message}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <form onSubmit={handleSendMessage} className="mt-4">
        <div className="mb-2">
          <label class="block text-gray-700 font-bold mb-2" htmlFor="response">
            Resposta
          </label>
          <textarea
            rows={4}
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="response"
            placeholder="Digite sua Resposta..."
          ></textarea>
        </div>
        <button
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Enviar
          </button>
      </form>
      <hr className="mt-6 border border-gray-400" />
      <div className="mt-8 text-center">
        <p className="text-gray-700">
          Não Quer Responder ou Resolvemos sua Questão? <Link href="/support" className="text-blue-600">Voltar para a Página do Ticket</Link>.
        </p>
      </div>
    </BaseLayout>
  )
}