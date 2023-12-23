import Link from "next/link"
import BaseLayout from "@/components/shared/BaseLayout"
import ProtectedRoute from "@/components/routes/ProtectedRoute"
import { useState, useContext } from 'react'
import { updateUser } from '@/services/userService'
import { validateCnpj, validateEmail, validateCpf } from '@/utils/utils'
import { AuthContext } from "@/contexts/authContext"
import { useRouter } from 'next/router'

export default function UpdateProfile() {
  
  const router = useRouter()
  const { user, setUser } = useContext(AuthContext)

  const [formData, setFormData] = useState({
    email: user.email,
    cpf: user.is_superuser ? user.cpf : null,
    cnpj: user.is_superuser ? null : user.cnpj,
    address: user.is_superuser ? null : user.address,
    username: user.username,
    name: user.is_superuser ? null : user.name
  })

  const [formErrors, setFormErrors] = useState({
    email: "",
    cpf: "",
    cnpj: "",
    address: "",
    name: ""
  })

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
      if (name === "cpf")
        errors.cpf = ""
      if (name === 'address')
        errors.address = ''
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
    if (formData.cpf && !validateCpf(formData.cpf))
      errors.cpf = 'CPF inválido.'
      
    if (Object.values(errors).some(value => value !== "")) {
      setFormErrors(errors)
      return
    }

    try {
      const data = await updateUser(formData, user.id, formData.username)
      setUser({
        ...user,
        cpf: data.cpf,
        cnpj: data.cnpj,
        email: data.email,
        address: data.address,
        name: data.name
      })
      router.push('/profile')
    } catch (e) {
      const errorObj = JSON.parse(e.message)
      setFormErrors(errorObj)
    }
  }

  return (
    <ProtectedRoute isProtected>
      <BaseLayout>
        <h1 className="text-4xl font-bold text-slate-800 text-center lg:text-start mb-8">Atualizar Perfil</h1>
        <form onSubmit={handleSubmit}>
          { user.is_superuser ? 
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="cpf">
                CPF
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="cpf"
                type="text"
                placeholder="XXX.XXX.XXX-XX"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                required
              />
              {formErrors.cpf && <p className="mt-2 text-red-600">{formErrors.cpf}</p>}
            </div>
            :
            <>
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
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="address">
                  Endereço
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="address"
                  type="text"
                  placeholder="Digite o Endereço"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
                {formErrors.address && <p className="mt-2 text-red-600">{formErrors.address}</p>}
              </div>
              <div className="mb-6">
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
            </>
          }
          <button
            className="w-full lg:w-auto px-6 py-3 rounded-md shadow-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            type="submit"
          >
            Atualizar
          </button>
        </form>
        <hr className="mt-6 border border-gray-400" />
        <div className="mt-8 text-center">
          <p className="text-gray-700">
            Não quer Atualizar o Perfil? <Link href="/profile" className="text-blue-600">Voltar para a Página de Perfil</Link>.
          </p>
        </div>
      </BaseLayout>
    </ProtectedRoute>
  )
}