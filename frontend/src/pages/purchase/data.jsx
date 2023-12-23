import Link from "next/link"
import BaseLayout from "@/components/shared/BaseLayout"
import ProtectedRoute from "@/components/routes/ProtectedRoute"
import { useState, useContext } from 'react'
import { AuthContext } from "@/contexts/authContext"
import { updateSalesOrder, getUserUnfinishedSalesOrder, getUserProductsInSalesOrder, updateSupplierOrder, 
  getUserUnfinishedSupplierOrder, getUserProductsInSupplierOrder, registerSalesInvoice, registerItemSalesInvoice, 
  registerSupplierInvoice, registerItemSupplierInvoice, updateSalesInvoice, updateSupplierInvoice } from "@/services/orderService"
import { registerTicket } from "@/services/supportService"
import { getAdministrator } from "@/services/userService"
import { useRouter } from "next/router"

export default function PurchaseData() {

  const router = useRouter()
  const { user } = useContext(AuthContext)
  const [futureDelivery, setFutureDelivery] = useState("false")
  const [formData, setFormData] = useState({
    deliveryDate: "",
    deliveryFrequency: "",
    faturedPayment: false
  })
  const [formErrors, setFormErrors] = useState({
    deliveryDate: "",
    deliveryFrequency: ""
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const inputValue = type === "checkbox" ? checked : value
  
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: inputValue,
    }))

    setFormErrors((prevErrors) => {
      const errors = { ...prevErrors }
      if (name === 'deliveryDate')
        errors.deliveryDate = ''
      if (name === 'deliveryFrequency')
        errors.deliveryFrequency = ''
      return errors
    })
  }

  const handlePurchasingOrganizationSubmit = async (e) => {
    e.preventDefault()
    
    if (Object.values(formErrors).some(value => value !== ""))
      return
  
    try {
      const admin = await getAdministrator()
      const salesOrder = await getUserUnfinishedSalesOrder(user.id)

      if (salesOrder == false) {
        alert("Você deve adicionar pelo menos 1 produto ao carrinho para realizar uma compra.")
        return
      }
      if (user.canPurchase === false) {
        alert("Você não pode realizar compras até efetuar os pagamentos que estão pendentes.")
        return
      }
      
      const salesInvoice = await registerSalesInvoice()
      const cartItems = await getUserProductsInSalesOrder(salesOrder.id, user.id)
      const totalSaleValue = cartItems.reduce((acc, item) => acc + item.salePrice, 0)

      for (const item of cartItems)
        await registerItemSalesInvoice({ quantity: item.quantity, salePrice: item.salePrice, salesInvoice: salesInvoice.id})

      await updateSalesInvoice({ salePrice: totalSaleValue, number: salesInvoice.id }, salesInvoice.id)

      await updateSalesOrder({
        id: salesOrder.id,
        orderDate: new Date(),
        deliveryDate: formData.deliveryDate === "" ? null : formData.deliveryDate,
        cancelled: false,
        sending: false,
        recieved: false,
        paid: null,
        finished: true,
        faturedPayment: formData.faturedPayment,
        totalSaleValue: totalSaleValue,
        deliveryFrequency: formData.deliveryFrequency === "" ? null : formData.deliveryFrequency,
      }, salesOrder.id)

      await registerTicket({
        sender: admin.id,
        recipient: user.id,
        subject: `${user.name}: Compra Realizada com Sucesso.`,
        content: `Sua compra foi efetuada com sucesso. Número do Pedido: ${salesOrder.id}.`,
        answer: null
      })

      router.push('/support')
    } catch (e) {
      const errorObj = JSON.parse(e.message)
      setFormErrors(errorObj)
    }
    return
  }

  const handleAdministratorSubmit = async (e) => {
    e.preventDefault()
    
    if (Object.values(formErrors).some(value => value !== ""))
      return
  
    try {
      const supplierOrder = await getUserUnfinishedSupplierOrder(user.id)

      if (supplierOrder == false) {
        alert("Você deve adicionar pelo menos 1 produto ao carrinho para realizar uma compra.")
        return
      }

      const supplierInvoice = await registerSupplierInvoice()
      const cartItems = await getUserProductsInSupplierOrder(supplierOrder.id, user.id)
      const totalCostValue = cartItems.reduce((acc, item) => acc + item.costPrice, 0)

      for (const item of cartItems)
        await registerItemSupplierInvoice({ quantity: item.quantity, costPrice: item.costPrice, supplierInvoice: supplierInvoice.id})

      await updateSupplierInvoice({ costPrice: totalCostValue, number: supplierInvoice.id }, supplierInvoice.id)

      await updateSupplierOrder({
        id: supplierOrder.id,
        orderDate: new Date(),
        deliveryDate: formData.deliveryDate === "" ? null : formData.deliveryDate,
        cancelled: false,
        recieved: null,
        finished: true,
        faturedPayment: formData.faturedPayment,
        totalCostValue: totalCostValue,
        deliveryFrequency: formData.deliveryFrequency === "" ? null : formData.deliveryFrequency,
      }, supplierOrder.id)

      router.push('/orders')
    } catch (e) {
      const errorObj = JSON.parse(e.message)
      setFormErrors(errorObj)
    }
    return
  }

  return (
    <ProtectedRoute isProtected>
      <BaseLayout>
        <h1 className="text-4xl font-bold text-slate-800 text-center lg:text-start mb-8">Dados de Pagamento</h1>
        <form onSubmit={user.is_superuser ? handleAdministratorSubmit : handlePurchasingOrganizationSubmit}>
          <div className="mb-4">
            <label htmlFor="futureDeliveryYes" className="block text-base font-medium text-gray-700 mb-2">
              Entrega Futura
            </label>
            <div className="flex items-center gap-6">
              <div>
                <input
                  type="radio"
                  id="futureDeliveryYes"
                  name="futureDelivery"
                  className="mr-2"
                  value="true"
                  checked={futureDelivery === "true"}
                  onChange={e => setFutureDelivery("true")}
                />
                <label htmlFor="futureDeliveryYes" className="text-gray-700">
                  Sim
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="futureDeliveryNo"
                  name="futureDelivery"
                  className="mr-2"
                  value="false"
                  checked={futureDelivery === "false"}
                  onChange={e => setFutureDelivery("false")}
                />
                <label htmlFor="futureDeliveryNo" className="text-gray-700">
                  Não
                </label>
              </div>
            </div>
          </div>
          {futureDelivery === "true" && (
            <>
              <div className="mb-4">
                <label htmlFor="deliveryDate" className="block text-base font-medium text-gray-700 mb-2">
                  Data da Entrega
                </label>
                <input
                  type="date"
                  id="deliveryDate"
                  name="deliveryDate"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.deliveryDate}
                  onChange={handleChange}
                  required
                />
                {formErrors.deliveryDate && <p className="mt-2 text-red-600">{formErrors.deliveryDate}</p>}
              </div>
              <div className="mb-4">
                <label htmlFor="deliveryFrequency" className="block text-base font-medium text-gray-700 mb-2">
                  Periodicidade da Recorrência em Dias
                </label>
                <input
                  type="number"
                  id="deliveryFrequency"
                  name="deliveryFrequency"
                  className="mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.deliveryFrequency}
                  min={10}
                  onChange={handleChange}
                />
                {formErrors.deliveryFrequency && <p className="mt-2 text-red-600">{formErrors.deliveryFrequency}</p>}
                <div className="text-gray-600 mt-2">
                  <p>
                    Se você não deseja que esse pedido seja entregue periodicamente deixe este campo em branco.
                  </p>
                  <p>
                    Se você deseja que esse pedido seja entregue periodicamente preencha-o com valor de no mínimo 10.
                  </p>
                </div>
              </div>
            </>
          )}
          <div className="mb-1">
            <label htmlFor="faturedPayment" className="block text-base font-medium text-gray-700 mb-2">
              Pagamento Faturado
            </label>
            <input
              type="checkbox"
              id="faturedPayment"
              name="faturedPayment"
              className="form-checkbox h-6 w-6 text-indigo-600 transition duration-150 ease-in-out"
              checked={formData.faturedPayment}
              onChange={handleChange}
              disabled={!user.authorizeFature}
            />
          </div>
          { user.authorizeFature ?
            <div className="text-gray-600 mb-4">
              <p>
                Se este campo for preenchido o pagamento vai ser feito 30 dias após a realização da compra.
              </p>
              <p>
                Se este campo não for preenchido o pagamento vai ser feito na hora do recebimento do produto.
              </p>
            </div>
            :
            <p className="text-gray-600 mb-4">
              Você não tem permissão para realizer compras faturadas.
            </p>
          }
          <button
            className="w-full lg:w-auto px-6 py-3 rounded-md shadow-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            type="submit"
          >
            Finalizar Compra
          </button>
        </form>
        <hr className="mt-6 border border-gray-400" />
        <div className="mt-8 text-center">
          <p className="text-gray-700">
            Não quer finalizar a compra? <Link href="/cart" className="text-blue-600">Voltar para a Página de Carrinho</Link>.
          </p>
        </div>
      </BaseLayout>
    </ProtectedRoute>
  )
}