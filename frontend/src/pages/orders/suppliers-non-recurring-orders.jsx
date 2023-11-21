import Link from "next/link"
import BaseLayout from "@/components/shared/BaseLayout"
import ProtectedRoute from "@/components/routes/ProtectedRoute"
import Modal from "@/components/shared/Modal"
import { useState, useEffect } from "react"
import { getSupplierOrders, updateSupplierOrder, getUserProductsInSupplierOrder } from "@/services/orderService"
import { updateProduct, getProduct } from "@/services/productService"
import { getSuppliers } from "@/services/supplierService"

export default function SuppliersNonRecurringOrders() {
  
  const [orders, setOrders] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [recievedModalState, setRecievedModalState] = useState({})
  const [unrecievedModalState, setUnrecievedModalState] = useState({})

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orders = await getSupplierOrders()
        setOrders(orders.filter(order => order.deliveryFrequency === null))
      } catch (e) {
        alert(e.message)
      }
    }
    
    const fetchSuppliers = async () => {
      try {
        const suppliers = await getSuppliers()
        setSuppliers(suppliers)
      } catch (e) {
        alert(e.message)
      }
    }
    
    fetchOrders()
    fetchSuppliers()
  }, [])

  const handleRecievedOrder = async (order, value, modalState) => {
    try {
      if (value === true) {
        await updateSupplierOrder({ recieved: true }, order.id)
        
        const cartItems = await getUserProductsInSupplierOrder(order.id, order.user)
        await Promise.all(cartItems.map(async (cartItem) => {
          const product = await getProduct(cartItem.product)
          await updateProduct(
            { id: product.id, 
              currentStockQuantity: product.currentStockQuantity + cartItem.quantity,
              visible: true
            }, cartItem.product)
        }))
      }
      else if (value === false)
        await updateSupplierOrder({ recieved: false }, order.id)
        
      const orders = await getSupplierOrders()
      setOrders(orders.filter(order => order.deliveryFrequency === null))
    } catch (e) {
      alert(e)
    }
    modalState({})
  }

  return (
    <ProtectedRoute isProtected isAdminOnly>
      <BaseLayout>
        <h1 className="text-4xl font-bold text-slate-800 mb-8">Pedidos Não Recorrentes dos Fornecedores</h1>
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Pedido
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Fornecedor
                </th>
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
                  Data de Entrega
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Recebido</span>
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Não Recebido</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => {
                const supplier = suppliers.find(supplier => supplier.id === order.supplier)

                return (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-800">
                      {supplier.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-800">
                      {supplier.cnpj}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-800">
                      {new Date(order.orderDate).toLocaleString('pt-BR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-800">
                      R$ {(order.totalCostValue).toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-800">
                      {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString('pt-BR') : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {order.recieved === null ?
                  <>
                    <button
                      onClick={() => setRecievedModalState({ [order.id]: true })}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Recebido
                    </button>
                    <Modal
                      isOpen={recievedModalState[order.id] || false}
                      onClose={() => setRecievedModalState({})}
                      onConfirm={() => handleRecievedOrder(order, true, setRecievedModalState)}
                      confirm
                      title="Confirmação de Recebimento"
                      message={`Tem certeza que deseja marcar este pedido como recebido?`}
                      option1="Sim"
                      option2="Não"
                    />
                  </>
                  : order.recieved === true ? 
                    <div className="text-sm text-green-600">Recebido</div>
                    :
                    <div className="text-sm text-gray-800">-</div>
                  }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {order.recieved === null ?
                  <>
                    <button
                      onClick={() => setUnrecievedModalState({ [order.id]: true })}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Não Recebido
                    </button>
                    <Modal
                      isOpen={unrecievedModalState[order.id] || false}
                      onClose={() => setUnrecievedModalState({})}
                      onConfirm={() => handleRecievedOrder(order, false, setUnrecievedModalState)}
                      title="Confirmação de Recebimento"
                      message={`Tem certeza que deseja marcar este pedido como não recebido?`}
                      option1="Sim"
                      option2="Não"
                    />
                  </>
                  : order.recieved === true ? 
                    <div className="text-sm text-gray-800">-</div>
                    :
                    <div className="text-sm text-red-600">Não Recebido</div>
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
            Não quer Analisar os Pedidos dos Fornecedores? <Link href="/orders" className="text-blue-600">Voltar para a Página de Pedidos</Link>.
          </p>
        </div>
      </BaseLayout>
    </ProtectedRoute>
  )
}