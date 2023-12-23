import Link from "next/link"
import ProtectedRoute from "@/components/routes/ProtectedRoute"
import BaseLayout from "@/components/shared/BaseLayout"
import { useState } from 'react'
import { useRouter } from "next/router"
import { registerPromotion } from "@/services/marketingService"

export default function RegisterPromotion() {

  const router = useRouter()
  const { productId } = router.query
  const [formErrors, setFormErrors] = useState({
    startDate: "",
    endDate: "",
    salePrice: "",
  })
  const [successMessage, setSuccessMessage] = useState("")
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    salePrice: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }))

    setFormErrors((prevErrors) => {
      const errors = { ...prevErrors }
      if (name === 'startDate') {
        errors.startDate = ''
        errors.endDate = ''
      }
      if (name === 'endDate') {
        errors.startDate = ''
        errors.endDate = ''
      }
      if (name === 'salePrice')
        errors.salePrice = ''
      return errors
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccessMessage("")

    if (Object.values(formErrors).some(value => value !== ""))
      return

    try {
      await registerPromotion({
        ...formData,
        product: productId
      })

      setSuccessMessage("Promoção criada com sucesso.")
      setFormData((prevStateData) => ({
        ...prevStateData,
        startDate: "",
        endDate: "",
        salePrice: "",
      }))
    } catch (e) {
      const errorObj = JSON.parse(e.message)
      setFormErrors(errorObj)
    }
    return
  }
  
  return (
    <ProtectedRoute isProtected isAdminOnly>
      <BaseLayout>
        <h1 className="text-4xl font-bold text-slate-800 text-center md:text-start mb-8">Registrar Promoção</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="startDate" className="block text-base font-medium text-gray-700 mb-2">Data Inicial</label>
            <input 
              type="datetime-local" 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={handleChange}
              name="startDate"
              value={formData.startDate}
              id="startDate" 
              required
            />
            {formErrors.startDate && <p className="mt-2 text-red-600">{formErrors.startDate}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="endDate" className="block text-base font-medium text-gray-700 mb-2">Data Final</label>
            <input 
              type="datetime-local" 
              id="endDate" 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
              onChange={handleChange}
              name="endDate" 
              value={formData.endDate}
              required
            />
            {formErrors.endDate && <p className="mt-2 text-red-600">{formErrors.endDate}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="salePrice" className="block text-base font-medium text-gray-700 mb-2">Preço de Venda</label>
            <input 
              type="number" 
              id="salePrice" 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
              onChange={handleChange}
              name="salePrice" 
              min={0.01}
              step={0.01}
              value={formData.salePrice}
              required
            />
            {formErrors.salePrice && <p className="mt-2 text-red-600">{formErrors.salePrice}</p>}
          </div>
          {successMessage && <p className="mb-4 text-green-600">{successMessage}</p>}
          <button type="submit" className="w-full md:w-auto px-6 py-3 rounded-md shadow-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            Cadastrar
          </button>
        </form>
        <hr className="mt-6 border border-gray-400" />
        <div className="mt-8 text-center">
          <p className="text-gray-700">
            Não quer Cadastrar a Promoção? <Link href={`/products/${productId}`} className="text-blue-600">Voltar para a Página do Produto</Link>.
          </p>
        </div>
      </BaseLayout>
    </ProtectedRoute>
  )
}