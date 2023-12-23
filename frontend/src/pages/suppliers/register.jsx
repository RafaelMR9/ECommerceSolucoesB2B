import Link from "next/link"
import BaseLayout from "@/components/shared/BaseLayout"
import ProtectedRoute from "@/components/routes/ProtectedRoute"
import { useState } from "react"
import { registerSupplier } from "@/services/supplierService"
import { validateCnpj, validateEmail } from '@/utils/utils'

export default function RegisterSupplier() {
  
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
      await registerSupplier(formData)
      setSuccessMessage("Fornecedor criado com sucesso.")
    } catch (e) {
      const errorObj = JSON.parse(e.message)
      setFormErrors(errorObj)
    }
  }

  return (
    <ProtectedRoute isProtected isAdminOnly>
      <BaseLayout>
        <h1 className="text-4xl font-bold text-slate-800 text-center lg:text-start mb-8">Cadastrar Fornecedor</h1>
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
            className="w-full lg:w-auto px-6 py-3 rounded-md shadow-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Cadastrar
          </button>
        </form>
        <hr className="mt-6 border border-gray-400" />
        <div className="mt-8 text-center">
          <p className="text-gray-700">
            Não quer Cadastrar o Fornecedor? <Link href="/suppliers" className="text-blue-600">Voltar para a Página de Fornecedores</Link>.
          </p>
        </div>
      </BaseLayout>
    </ProtectedRoute>
  )
}