import Link from "next/link"
import BaseLayout from "@/components/shared/BaseLayout"
import ProtectedRoute from "@/components/routes/ProtectedRoute"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "@/contexts/authContext"
import { getUserTickets, getTickets } from "@/services/supportService"

export default function Support() {

  const { user } = useContext(AuthContext)
  const [tickets, setTickets] = useState([])

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        let tickets = []
        if (user.is_superuser)
        tickets = await getTickets()
        else
          tickets = await getUserTickets(user.id)

        setTickets(tickets)
      } catch (e) {
        alert(e.message)
      }
    }
    
    fetchTickets()
  }, [])

  return (
    <ProtectedRoute isProtected>
      <BaseLayout>
        <div className="flex justify-between mb-8">
          <h1 className="text-4xl font-bold text-slate-800">Meus Tickets</h1>
          { !user.is_superuser &&
            <Link href="/support/send-ticket" className="hover:bg-white border-2 border-blue-600 text-blue-600 flex items-center font-bold py-2 px-8 rounded focus:outline-none focus:shadow-outline">
              Enviar Ticket
            </Link>
          }
        </div>
        { tickets.length === 0 ?
          <p className="text-red-600 font-semibold text-lg mb-2">Você ainda não possui tickets cadastrados no momento.</p>
          :
          <div className="grid gap-8 lg:grid-cols-3">
            {tickets.map(ticket => (
              <div key={ticket.id} className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl border-4 border-transparent hover:border-slate-200">
                <Link href={`/support/${ticket.id}`} className="block px-4 py-5">
                  <h2 className="text-lg font-medium text-gray-900 mb-2">{ticket.subject}</h2>
                  <p className="text-md text-gray-700 mb-4">{ticket.content.slice(0, 30)}...</p>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">{ticket.date}</p>
                    <p className="text-sm text-gray-600">{ticket.cnpj}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        }
      </BaseLayout>
    </ProtectedRoute>
  )
}