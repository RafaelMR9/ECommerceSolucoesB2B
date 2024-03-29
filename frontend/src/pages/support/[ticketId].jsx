import Link from "next/link"
import BaseLayout from "@/components/shared/BaseLayout"
import ProtectedRoute from "@/components/routes/ProtectedRoute"
import { useState, useEffect, useContext } from "react"
import { AuthContext } from "@/contexts/authContext"
import { useRouter } from "next/router"
import { getTicket, getTicketResponses, registerTicket } from "@/services/supportService"
import { getAdministrator } from "@/services/userService"

export default function AnswerTicket() {

  const router = useRouter()
  const { user } = useContext(AuthContext)
  const { ticketId } = router.query
  const [ticket, setTicket] = useState({})
  const [administrador, setAdministrador] = useState({})
  const [responses, setResponses] = useState([])
  const [newResponse, setNewResponse] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setIsLoading(true)

        const ticket = await getTicket(ticketId)
        const responses = await getTicketResponses(ticketId)
        const administrator = await getAdministrator()
        responses.unshift(ticket)

        setResponses(responses)
        setTicket(ticket)
        setAdministrador(administrator)
        setIsLoading(false)

      } catch (e) {
        setIsLoading(false)
        router.push("/support")
      }
    }

    fetchTicket()
  }, [])

  const handleChange = (e) => {
    setNewResponse(e.target.value)
    setErrorMessage("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (errorMessage)
      return

    try {
      await registerTicket({
        originalTicket: ticketId,
        sender: user.id,
        recipient: ticket.sender,
        subject: null,
        content: newResponse,
        answer: ticketId
      })

      const responses = await getTicketResponses(ticketId)
      responses.unshift(ticket)
      setResponses(responses)
      setNewResponse("")
    } catch (e) {
      const errorObj = JSON.parse(e.message)
      setErrorMessage(errorObj.content)
    }
    return
  }
  return (
    <ProtectedRoute isProtected>
      <BaseLayout>
        {isLoading ?
          <div className="flex items-center justify-center mt-32">
            <div className={`animate-spin ease-linear rounded-full h-32 w-32 pt-14 border-8 border-l-gray-400 border-r-gray-400 border-b-gray-400 border-t-indigo-900`} />
          </div>
          :
          <>
            <h1 className="text-4xl font-bold text-slate-800 text-center lg:text-start mb-8">Suporte - Conversa</h1>
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <div className="px-4 py-5">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {ticket.subject}
                </h3>
                <p className="mt-1 max-w-2xl text-md text-gray-500">
                  {new Date(ticket.dateHour).toLocaleString()}
                </p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5">
                <dl className="sm:divide-y sm:divide-gray-200">
                  {responses.map((response, idx) => {
                    return (
                      <div
                        key={response.id}
                        className={`px-4 py-5 sm:grid sm:grid-cols-3 ${idx % 2 === 0 ? "bg-gray-100" : ""
                          }`}
                      >
                        <dt className="text-md font-medium text-gray-700">
                          {response.sender === user.id ? "Você" : administrador.id === response.sender ? "Administrador" : "Organização Compradora"}
                        </dt>
                        <p className="text-sm text-gray-600">
                          {new Date(response.dateHour).toLocaleString()}
                        </p>
                        <dd className="mt-1 text-sm text-gray-900">
                          {response.content}
                        </dd>
                      </div>
                    )
                  })}
                </dl>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="mb-2">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="newResponse">
                  Resposta
                </label>
                <textarea
                  rows={4}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="newResponse"
                  name="newResponse"
                  value={newResponse}
                  onChange={handleChange}
                  placeholder="Digite sua Resposta..."
                  required
                ></textarea>
              </div>
              {errorMessage && <p className="mb-2 text-red-600">{errorMessage}</p>}
              <button
                className="w-full lg:w-auto px-6 py-3 rounded-md shadow-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                type="submit"
              >
                Enviar
              </button>
            </form>
            <hr className="mt-6 border border-gray-400" />
            <div className="mt-8 text-center">
              <p className="text-gray-700">
                Não quer Responder ou Resolvemos sua Questão? <Link href="/support" className="text-blue-600">Voltar para a Página de Suporte</Link>.
              </p>
            </div>
          </>
        }
      </BaseLayout>
    </ProtectedRoute>
  )
}