import Link from "next/link"
import BaseLayout from "@/components/shared/BaseLayout"
import ProtectedRoute from "@/components/routes/ProtectedRoute"
import { useState, useEffect } from 'react'
import { updateCarrier, getCarrier } from '@/services/carrierService'
import { validateCnpj, validateEmail } from '@/utils/utils'
import { useRouter } from 'next/router'

export default function UpdateCarrier() {
  
  const router = useRouter()
  const { carrierId } = router.query

  const [formData, setFormData] = useState({
    email: "",
    cnpj: "",
    name: ""
  })
  const [formErrors, setFormErrors] = useState({
    email: "",
    cnpj: "",
    name: ""
  })

  useEffect(() => {
    const fetchCarrier = async () => {
      try {
        const carrier = await getCarrier(carrierId)
        setFormData(carrier)
      } catch (e) {
        alert(e.message)
      }
    }

    fetchCarrier()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevStateData) => ({
      ...prevStateData,
      [name]: value,
    }))
    setFormErrors((prevErrors) => {
      const errors = { ...prevErrors }
      if (name === "email")
        errors.email = "" 
      if (name === "cnpj")
        errors.cnpj = ""
      if (name === 'name')
        errors.name = ''
      return errors
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const errors = { ...formErrors }
    if (formData.email && !validateEmail(formData.email))
      errors.email = 'E-Mail inválido.'
    if (formData.cnpj && !validateCnpj(formData.cnpj))
      errors.cnpj = 'CNPJ inválido.'
      
    if (Object.values(errors).some(value => value !== "")) {
      setFormErrors(errors)
      return
    }

    try {
      await updateCarrier(formData, carrierId)
      router.push(`/carriers/${carrierId}`)
    } catch (e) {
      const errorObj = JSON.parse(e.message)
      setFormErrors(errorObj)
    }
  }

  return (
    <ProtectedRoute isProtected isAdminOnly>
      <BaseLayout>
        <h1 className="text-4xl font-bold text-slate-800 text-center lg:text-start mb-8">Atualizar Transportadora</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
              Nome
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Digite o Nome"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            {formErrors.name && <p className="mt-2 text-red-600">{formErrors.name}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
              E-Mail
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {formErrors.email && <p className="mt-2 text-red-600">{formErrors.email}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="cnpj">
              CNPJ
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="cnpj"
              type="text"
              placeholder="XX.XXX.XXX/XXX-XX"
              name="cnpj"
              value={formData.cnpj}
              onChange={handleChange}
              required
            />
            {formErrors.cnpj && <p className="mt-2 text-red-600">{formErrors.cnpj}</p>}
          </div>
          <button
            className="w-full lg:w-auto px-6 py-3 rounded-md shadow-sm font-medium text-white bg-blue-600 hover:bg-blue-70"
            type="submit"
          >
            Atualizar
          </button>
        </form>
        <hr className="mt-6 border border-gray-400" />
        <div className="mt-8 text-center">
          <p className="text-gray-700">
            Não quer Atualizar a Transportadora? <Link href={`/carriers/${carrierId}`} className="text-blue-600">Voltar para a Página da Transportadora</Link>.
          </p>
        </div>
      </BaseLayout>
    </ProtectedRoute>
  )
}