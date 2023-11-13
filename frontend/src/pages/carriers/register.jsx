import Link from "next/link"
import BaseLayout from "@/components/shared/BaseLayout"
import ProtectedRoute from "@/components/routes/ProtectedRoute"
import { useState } from "react"
import { registerCarrier } from "@/services/carrierService"
import { validateCnpj, validateEmail } from '@/utils/utils'

export default function RegisterCarrier() {
  
  const [successMessage, setSuccessMessage] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    cnpj: "",
  })
  const [formErrors, setFormErrors] = useState({
    email: "",
    name: "",
    cnpj: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevStateData) => ({
      ...prevStateData,
      [name]: value,
    }))

    setFormErrors((prevErrors) => {
      const errors = { ...prevErrors }
      if (name === 'email')
        errors.email = ''
      if (name === 'cnpj')
        errors.cnpj = ''
      if (name === 'name')
        errors.name = ''
      return errors
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    setSuccessMessage("")

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
      await registerCarrier(formData)
      setSuccessMessage("Transportadora criada com sucesso.")
    } catch (e) {
      const errorObj = JSON.parse(e.message)
      setFormErrors(errorObj)
    }
  }

  return (
    <ProtectedRoute isProtected isAdminOnly>
      <BaseLayout>
        <h1 className="text-4xl font-bold text-slate-800 mb-8">Cadastrar Transportadora</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-base font-medium text-gray-700 mb-2">
              Nome
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.name}
              onChange={handleChange}
              required
            />
            {formErrors.name && <p className="mt-2 mb-4 text-red-600">{formErrors.name}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-base font-medium text-gray-700 mb-2">
              E-Mail
            </label>
            <input
              type="text"
              id="email"
              name="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {formErrors.email && <p className="mt-2 mb-4 text-red-600">{formErrors.email}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="cnpj" className="block text-base font-medium text-gray-700 mb-2">
              CNPJ
            </label>
            <input
              type="text"
              id="cnpj"
              placeholder="XX.XXX.XXX/XXX-XX"
              name="cnpj"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.cnpj}
              onChange={handleChange}
              required
            />
            {formErrors.cnpj && <p className="mt-2 mb-4 text-red-600">{formErrors.cnpj}</p>}
          </div>
          {successMessage && <p className="mb-4 text-green-600">{successMessage}</p>}
          <button
            type="submit"
            className="inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
          >
            Cadastrar
          </button>
        </form>
        <hr className="mt-6 border border-gray-400" />
        <div className="mt-8 text-center">
          <p className="text-gray-700">
            Não quer Cadastrar a Transportadora? <Link href="/carriers" className="text-blue-600">Voltar para a Página de Transportadoras</Link>.
          </p>
        </div>
      </BaseLayout>
    </ProtectedRoute>
  )
}