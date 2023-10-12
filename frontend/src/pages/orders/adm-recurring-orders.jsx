import Link from "next/link"
import BaseLayout from "@/components/shared/BaseLayout"
import ProtectedRoute from "@/components/routes/ProtectedRoute"
import Modal from "@/components/shared/Modal"
import { useState, useEffect } from "react"
import { getSalesOrders, updateSalesOrder, getUserProductsInSalesOrder } from "@/services/orderService"
import { getUsers } from "@/services/userService"
import { updateProduct, getProduct } from "@/services/productService"

export default function AdminRecurringOrders() {
  
  const [orders, setOrders] = useState([])
  const [companies, setCompanies] = useState([])
  const [prepareModalState, setPrepareModalState] = useState({})
  const [cancelModalState, setCancelModalState] = useState({})

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orders = await getSalesOrders()
        setOrders(orders.filter(order => order.deliveryFrequency !== null))
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

  const handlePrepareOrder = async (order, value, modalState) => {
    try {
      if (value === true) {
        await updateSalesOrder({ cancelled: value }, order.id)
        
        const cartItems = await getUserProductsInSalesOrder(order.id, order.user)
        await Promise.all(cartItems.map(async (cartItem) => {
          const product = await getProduct(cartItem.product)
          await updateProduct(
            { id: product.id, 
              currentStockQuantity: product.currentStockQuantity + cartItem.quantity,
              visible: true
            }, cartItem.product)
        }))
      }
      else if (value === null)
        await updateSalesOrder({ cancelled: value }, order.id)
        
      const orders = await getSalesOrders()
      setOrders(orders.filter(order => order.deliveryFrequency !== null))
    } catch (e) {
      alert(e)
    }
    modalState({})
  }

  return (
    <ProtectedRoute isProtected isAdminOnly>
      <BaseLayout>
        <h1 className="text-4xl font-bold text-slate-800 mb-8">Pedidos Recorrentes dos Clientes</h1>
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
                  Frequência da Entrega
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Próxima Data de Entrega
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Última Data de Entrega
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Enviar</span>
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Não Enviar</span>
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
                      {order.deliveryFrequency} Dias
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-800">
                      {new Date(order.deliveryDate).toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-800">
                      {new Date(order.deliveryDate).toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  { order.cancelled === false ?
                    <>
                      <button 
                        onClick={() => setPrepareModalState({ [order.id]: true })} 
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Enviar
                      </button>
                      <Modal
                        isOpen={prepareModalState[order.id] || false}
                        onClose={() => setPrepareModalState({})}
                        onConfirm={() => handlePrepareOrder(order, null, setPrepareModalState)}
                        confirm
                        title="Confirmação de Preparo"
                        message={`Tem certeza que deseja preparar este pedido para envio?`}
                        option1="Sim"
                        option2="Não"
                      />
                    </>
                    : order.cancelled === true ?
                    <div className="text-sm text-gray-800">-</div>
                    :
                    <div className="text-sm text-green-600">Preparando para Envio</div>
                  }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  { order.cancelled === false ?
                    <>
                      <button 
                        onClick={() => setCancelModalState({ [order.id]: true })} 
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        Cancelar Pedido
                      </button>
                      <Modal
                        isOpen={cancelModalState[order.id] || false}
                        onClose={() => setCancelModalState({})}
                        onConfirm={() => handlePrepareOrder(order, true, setCancelModalState)}
                        title="Confirmação de Remoção"
                        message={`Tem certeza que deseja cancelar este pedido?`}
                        option1="Sim"
                        option2="Não"
                      />
                    </>
                    : order.cancelled === true ?
                    <div className="text-sm text-red-600">Cancelado</div>
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
            Não quer Analisar os Pedidos Recorrentes dos Clientes? <Link href="/orders" className="text-blue-600">Voltar para a Página de Pedidos</Link>.
          </p>
        </div>
      </BaseLayout>
    </ProtectedRoute>
  )
}
