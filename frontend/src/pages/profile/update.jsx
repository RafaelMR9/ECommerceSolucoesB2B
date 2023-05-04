import Link from "next/link"
import { useState, useContext } from 'react'
import BaseLayout from "../../components/shared/BaseLayout"
import ProtectedRoute from "@/components/routes/ProtectedRoute"
import { updateUser } from '@/services/userService'
import { handleChange, validateCnpj, validateEmail, validateCpf } from '@/utils/utils'
import { AuthContext } from "@/contexts/authContext"

export default function UpdateProfile() {
  const { user, setUser } = useContext(AuthContext)

  const [formData, setFormData] = useState({
    email: user.email,
    cpf: user.eAdministrador ? user.cpf : null,
    cnpj: user.eAdministrador ? null : user.cnpj,
    adress: user.eAdministrador ? null : user.endereco
  })

  const [formErrors, setFormErrors] = useState({
    email: "",
    cpf: "",
    cnpj: "",
    address: ""
  })

  const handleBlur = (e) => {
    const { name, value } = e.target
    const errors = { ...formErrors }

    if (name === "email" && value.length !== 0 && !validateEmail(value))
      errors[name] = "Email inválido." 
    else if (name === "cnpj" && value.length !== 0 && !validateCnpj(value))
      errors[name] = "CNPJ inválido."
    else if (name === "cpf" && value.length !== 0 && !validateCpf(value))
      errors[name] = "CPF inválido."
    else
      delete errors[name]

    setFormErrors(errors)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formErrors.email || formErrors.cnpj || formErrors.password || formErrors.confirmPassword)
      return

    try {
      const data = await updateUser(formData, user.user_id)
      console.log(data)
      setUser({
        ...user,
        cpf: data.cpf,
        cnpj: data.cnpj,
        email: data.email,
        endereco: data.endereco

      })
    } catch (e) {
      const errorObj = JSON.parse(e.message)
      if ('endereco' in errorObj) {
        errorObj.address = errorObj.endereco
        delete errorObj.endereco
      }

      setFormErrors(errorObj)
    }
  }

  return (
    <ProtectedRoute isProtected>
      <BaseLayout>
        <h1 className="text-4xl font-bold text-slate-800 mb-8">Atualizar Perfil</h1>
        <form onSubmit={handleSubmit}>
          { user.eAdministrador ? 
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
                onChange={e => handleChange(e, setFormData)}
                onBlur={handleBlur}
                required
              />
              {formErrors.cpf && <p className="mt-2 text-red-600">{formErrors.cpf}</p>}
            </div>
            :
            <>
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
                  onChange={e => handleChange(e, setFormData)}
                  onBlur={handleBlur}
                  required
                />
                {formErrors.cnpj && <p className="mt-2 text-red-600">{formErrors.cnpj}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="adress">
                  Endereço
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="adress"
                  type="text"
                  placeholder="Digite o Endereço"
                  name="address"
                  value={formData.adress}
                  onChange={e => handleChange(e, setFormData)}
                  onBlur={handleBlur}
                  required
                />
                {formErrors.address && <p className="mt-2 text-red-600">{formErrors.address}</p>}
              </div>
            </>
          }
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
              onChange={e => handleChange(e, setFormData)}
              onBlur={handleBlur}
              required
            />
            {formErrors.email && <p className="mt-2 text-red-600">{formErrors.email}</p>}
          </div>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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