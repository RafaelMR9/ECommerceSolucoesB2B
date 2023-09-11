import Link from "next/link"
import BaseLayout from "@/components/shared/BaseLayout"
import ProtectedRoute from "@/components/routes/ProtectedRoute"
import Modal from "@/components/shared/Modal"
import { useState, useEffect, useContext } from "react"
import { AuthContext } from "@/contexts/authContext"
import { getUserSalesOrder, updateSalesOrder } from "@/services/orderService"

export default function CompaniesClientOrders() {
  
  const { user } = useContext(AuthContext)
  const [orders, setOrders] = useState([])
  const [modalState, setModalState] = useState(false)

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const orders = await getUserSalesOrder(user.id)
        console.log(orders)
        setOrders(orders)
      } catch (e) {
        alert(e.message)
      }
    }
    
    fetchUserOrders()
  }, [])

  const handleCancelOrder = async (order) => {
    try {
      await updateSalesOrder({ cancelled: true }, order)
      const orders = await getUserSalesOrder(user.id)
        setOrders(orders)
    } catch (e) {
      alert(e)
    }
    setModalState({})
  }

  return (
    <ProtectedRoute isProtected>
      <BaseLayout>
        <h1 className="text-4xl font-bold text-slate-800 mb-8">Meus Pedidos</h1>
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Pedidos
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
                  Frequência da Entrega
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Data de Entrega
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status do Pedido
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-800">{new Date(order.orderDate).toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-800">{order.deliveryFrequency === 0 ? '-' : `${order.deliveryFrequency} Dias`}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-800">{order.deliveryDate ? order.deliveryDate : '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  { order.cancelled === false ?
                    <>
                      <button 
                        onClick={() => setModalState({ [order.id]: true })} 
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        Cancelar Pedido
                      </button>
                      <Modal
                        isOpen={modalState[order.id] || false}
                        onClose={() => setModalState({})}
                        onConfirm={() => handleCancelOrder(order.id)}
                        title="Confirmação de Remoção"
                        message={`Tem certeza que deseja cancelar este pedido?`}
                      />
                    </>
                    : order.cancelled === true ?
                    <div className="text-sm text-red-600">Cancelado</div>
                    :
                    <div className="text-sm text-green-600">Enviado</div>
                  }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <hr className="mt-6 border border-gray-400" />
        <div className="mt-8 text-center">
          <p className="text-gray-700">
            Não quer Cancelar seus Pedidos? <Link href="/" className="text-blue-600">Voltar para a Página Principal</Link>.
          </p>
        </div>
      </BaseLayout>
    </ProtectedRoute>
  )
}
