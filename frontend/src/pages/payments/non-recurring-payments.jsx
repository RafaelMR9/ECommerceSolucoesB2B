import Link from "next/link"
import BaseLayout from "@/components/shared/BaseLayout"
import ProtectedRoute from "@/components/routes/ProtectedRoute"
import Modal from "@/components/shared/Modal"
import { useState, useEffect } from "react"
import { getSalesOrders, updateSalesOrder } from "@/services/orderService"
import { getUsers, getAdministrator, getUser, updateUser } from "@/services/userService"
import { registerTicket } from "@/services/supportService"

export default function AdminNonRecurringPayments() {
  
  const [orders, setOrders] = useState([])
  const [companies, setCompanies] = useState([])
  const [paidModalState, setPaidModalState] = useState({})
  const [unpaidModalState, setUnpaidModalState] = useState({})

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orders = await getSalesOrders()
        setOrders(orders.filter(order => order.deliveryFrequency === null && order.cancelled === null))
      } catch (e) {
        alert(e.message)
      }
    }

    const fetchCompanies = async () => {
      try {
        const companies = await getUsers()
        setCompanies(companies)
      } catch (e) {
        alert(e.message)
      }
    }
    
    fetchOrders()
    fetchCompanies()
  }, [])

  const handlePaidOrder = async (order, value, modalState) => {
    try {
      if (value === true) 
        await updateSalesOrder({ paid: value, cancelled: order.cancelled, sending: order.sending, recieved: order.recieved }, order.id)
      else if (value === false) {
        const administrator = await getAdministrator()
        const user = await getUser(order.user)

        await updateSalesOrder({ paid: value, cancelled: order.cancelled, sending: order.sending, recieved: order.recieved }, order.id)
        await registerTicket({
          sender: administrator.id,
          recipient: user.id,
          subject: `${user.name}: Atraso no Pagamento.`,
          content: `Devido ao atraso no pagamento do pedido não recorrente de número ${order.id}, você estará impossibilitado de realizar futuras compras até efetuar os pagamentos pendentes.`,
          answer: null
        })
        await updateUser({
          ...user,
          canPurchase: false
        }, user.id, user.username)
      }
        
      const orders = await getSalesOrders()
      setOrders(orders.filter(order => order.deliveryFrequency === null && order.cancelled === null))
    } catch (e) {
      alert(e)
    }
    modalState({})
  }

  return (
    <ProtectedRoute isProtected isAdminOnly>
      <BaseLayout>
        <h1 className="text-4xl font-bold text-slate-800 mb-8">Pagamentos Não Recorrentes das Organizações Compradoras</h1>
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  CNPJ
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Nome
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Realização do Pedido
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Valor do Pedido
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Faturado
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Data de Entrega
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Pago</span>
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Não Pago</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => {
                const company = companies.find(company => company.id === order.user)

                return (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {company.cnpj}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-800">
                      {company.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-800">
                      {new Date(order.orderDate).toLocaleString('pt-BR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-800">
                      R$ {(order.totalSaleValue).toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-800">
                      {order.faturedPayment ? "Sim" : "Não"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-800">
                      {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString('pt-BR') : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  { order.paid === null ?
                    <>
                      <button 
                        onClick={() => setPaidModalState({ [order.id]: true })} 
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Pago
                      </button>
                      <Modal
                        isOpen={paidModalState[order.id] || false}
                        onClose={() => setPaidModalState({})}
                        onConfirm={() => handlePaidOrder(order, true, setPaidModalState)}
                        confirm
                        title="Confirmação de Pagamento"
                        message={`Tem certeza que deseja marcar este pedido como pago?`}
                        option1="Sim"
                        option2="Não"
                      />
                    </>
                    : order.paid === false ?
                    <div className="text-sm text-gray-800">-</div>
                    :
                    <div className="text-sm text-green-600">Pago</div>
                  }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  { order.paid === null ?
                    <>
                      <button 
                        onClick={() => setUnpaidModalState({ [order.id]: true })} 
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        Não Pago
                      </button>
                      <Modal
                        isOpen={unpaidModalState[order.id] || false}
                        onClose={() => setUnpaidModalState({})}
                        onConfirm={() => handlePaidOrder(order, false, setUnpaidModalState)}
                        title="Confirmação de Pagamento"
                        message={`Tem certeza que deseja marcar este pedido como não pago?`}
                        option1="Sim"
                        option2="Não"
                      />
                    </>
                    : order.paid === false ?
                    <div className="text-sm text-red-600">Não Pago</div>
                    :
                    <div className="text-sm text-gray-800">-</div>
                  }
                  </td>
                </tr>
              )})
              }
            </tbody>
          </table>
        </div>
        <hr className="mt-6 border border-gray-400" />
        <div className="mt-8 text-center">
          <p className="text-gray-700">
            Não quer Analisar os Pagamentos das Organizações Compradoras? <Link href="/payments" className="text-blue-600">Voltar para a Página de Pagamentos</Link>.
          </p>
        </div>
      </BaseLayout>
    </ProtectedRoute>
  )
}
