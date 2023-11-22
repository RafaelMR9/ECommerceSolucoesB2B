import BaseLayout from "@/components/shared/BaseLayout"
import ProtectedRoute from "@/components/routes/ProtectedRoute"
import Link from "next/link"
import Modal from "@/components/shared/Modal"
import { useState, useEffect } from "react"
import { getCarrier, removeCarrier,  } from "@/services/carrierService"
import { useRouter } from "next/router"
import { getSalesOrders } from "@/services/orderService"
import { getCarrierSalesShipment } from "@/services/carrierService"

export default function Carrier() {
  
  const router = useRouter()
  const { carrierId } = router.query
  const [carrier, setCarrier] = useState({})
  const [orders, setOrders] = useState([])
  const [salesShipment, setSalesShipment] = useState([])
  const [modalRemovalState, setModalRemovalState] = useState(false)
  const [modalErrorState, setModalErrorState] = useState(false)
  const [errorMessage, setErrorMessage] = useState({
    title: "",
    leading: ""
  })


  useEffect(() => {
    const fetchCarrier = async () => {
      try {
        const carrier = await getCarrier(carrierId)
        setCarrier(carrier)
      } catch (e) {
        router.push('/carriers')
      }
    }

    const fetchSalesShipment = async () => {
      try {
        const salesShipment = await getCarrierSalesShipment(carrierId)
        setSalesShipment(salesShipment)
      } catch (e) {
        alert(e.message)
      }
    }

    const fetchOrders = async () => {
      try {
        const orders = await getSalesOrders()
        setOrders(orders)
      } catch (e) {
        alert(e.message)
      }
    }

    fetchCarrier()
    fetchSalesShipment()
    fetchOrders()
  }, [])

  const handleRemoveCarrier = async (carrier) => {
    try {
      await removeCarrier(carrier)
      router.push('/carriers')
    } catch (e) {
      const objError = JSON.parse(e.message)
      setErrorMessage({ 
        title: objError.title,
        leading: objError.leading
      })
      setModalRemovalState({})
      setModalErrorState({ [carrierId]: true })
    }
  }

  return (
    <ProtectedRoute isProtected isAdminOnly>
      <BaseLayout>
        <div className="flex flex-wrap justify-between items-center mb-2">
          <h1 className="text-4xl font-bold text-slate-800 ">{carrier.name}</h1>
            <button
              onClick={() => setModalRemovalState({ [carrierId]: true })}
              className="ml-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-8 rounded">
              Remover Transportadora
            </button>
            <Modal
              isOpen={modalRemovalState[carrierId] || false}
              onClose={() => setModalRemovalState({})}
              onConfirm={() => handleRemoveCarrier(carrierId)}
              title="Confirmação de Remoção"
              message={`Tem certeza que deseja remover a transportadora '${carrier.name}'?`}
              option1="Remover"
              option2="Cancelar"
            />
            <Modal
              isOpen={modalErrorState[carrierId] || false}
              onClose={() => setModalErrorState({})}
              onConfirm={() => {setErrorMessage({title: "", leading: ""}); setModalErrorState({})}}
              title="Remoção Inválida"
              message={errorMessage.title}
              leading={errorMessage.leading}
              option1="Continuar"
              confirm
            />
        </div>
        <hr className="border-gray-400 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col justify-between">
            <div className="text-lg">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Informações da Transportadora</h2>
              <div className="bg-white rounded shadow p-4 mb-4">
                <p className="text-gray-600 font-semibold">CNPJ:</p>
                <p className="text-gray-800">{carrier.cnpj}</p>
              </div>
              <div className="bg-white rounded shadow p-4 mb-4">
                <p className="text-gray-600 font-semibold">Nome:</p>
                <p className="text-gray-800">{carrier.name}</p>
              </div>
              <div className="bg-white rounded shadow p-4 mb-4">
                <p className="text-gray-600 font-semibold">Email:</p>
                <p className="text-gray-800">{carrier.email}</p>
              </div>
          </div>
          <Link href={`/carriers/update?carrierId=${carrierId}`} className="w-96 text-center bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold py-4 px-16 rounded focus:outline-none focus:shadow-outline">
            Atualizar Transportadora
          </Link>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Pedidos Ativos</h2>
            {salesShipment
              .map((salesShipment) => {
                const order = orders.find((order) => order.id === salesShipment.salesOrder && order.sending === true && order.recieved === false)
                
                if (order) {
                  return (
                    <div key={salesShipment.id} className="mb-6 flex justify-between items-center text-lg">
                      <div>
                        <p className="text-gray-600 font-semibold">Pedido:</p>
                        <p className="text-gray-800">{salesShipment.salesOrder}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-semibold">Valor do Pedido:</p>
                        <p className="text-gray-800">R$ {(order.totalSaleValue).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-semibold">Data de Embarque:</p>
                        <p className="text-gray-800">{new Date(salesShipment.dateHour).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                  )
                }
            })}
          </div>
        </div>
      </BaseLayout>
    </ProtectedRoute>
  )
}