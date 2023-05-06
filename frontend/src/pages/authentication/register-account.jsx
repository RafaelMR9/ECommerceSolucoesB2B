import Link from 'next/link'
import { useState } from 'react'
import { validateCnpj, validateEmail, validatePassword, validateConfirmPassword } from '@/utils/utils'
import { registerUser } from '@/services/authService'
import { useRouter } from 'next/router'
import ProtectedRoute from '@/components/routes/ProtectedRoute'

export default function RegisterAccount() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    cnpj: "",
    email: "",
    authorizeFature: false,
    address: "",
  })

  const [formErrors, setFormErrors] = useState({
    username: "",
    email: "",
    cnpj: "",
    password: "",
    confirmPassword: "",
    address: ""
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === "checkbox" ? checked : value
    setFormData((prevStateData) => ({
      ...prevStateData,
      [name]: newValue,
    }))

    setFormErrors((prevErrors) => {
      const errors = { ...prevErrors }
      if (name === 'email' && validateEmail(value))
        errors.email = ''
      if (name === 'cnpj' && validateCnpj(value))
        errors.cnpj = ''
      if (name === 'password' && validatePassword(value))
        errors.password = ''
      if (name === 'confirmPassword' && validateConfirmPassword(formData.password, value))
        errors.confirmPassword = ''
      if (name === 'username')
        errors.username = ''
      if (name === 'address')
        errors.address = ''
      return errors
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const errors = { ...formErrors }
    if (formData.email && !validateEmail(formData.email))
      errors.email = 'Email inválido.'
    if (formData.cnpj && !validateCnpj(formData.cnpj))
      errors.cnpj = 'CNPJ inválido.'
    if (formData.password && !validatePassword(formData.password))
      errors.password = 'Senha inválida.'
    if (formData.confirmPassword && !validateConfirmPassword(formData.password, formData.confirmPassword))
      errors.confirmPassword = 'Senhas não coincidem.'

    if (Object.values(errors).some(value => value !== "")) {
      setFormErrors(errors)
      return
    }

    try {
      await registerUser(formData)
      router.push('/authentication')
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
    <ProtectedRoute isAuthPage>
      <div className="bg-gray-100 min-h-screen">
        <div className="mx-auto max-w-lg py-20">
          <div className="bg-white shadow-md rounded px-8 py-10">
            <h1 className="text-3xl text-gray-900 font-bold text-center mb-8">Registrar Conta</h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="username">
                  Usuário
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                />
                {formErrors.username && <p className="mt-2 text-red-600">{formErrors.username}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
                  Senha
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <ul className="mt-2 pl-5 list-disc text-sm text-gray-600">
                  <li>Senha deve possuir no mínimo 8 caracteres.</li>
                  <li>Senha não deve ser inteiramente numérica.</li>
                </ul>
                {formErrors.password && <p className="mt-2 text-red-600">{formErrors.password}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="confirmPassword">
                  Confirmar Senha
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {formErrors.confirmPassword && <p className="mt-2 text-red-600">{formErrors.confirmPassword}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="cnpj">
                  CNPJ
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                  id="cnpj"
                  name="cnpj"
                  type="text"
                  placeholder="XX.XXX.XXX/XXX-XX"
                  value={formData.cnpj}
                  onChange={handleChange}
                />
                {formErrors.cnpj && <p className="mt-2 text-red-600">{formErrors.cnpj}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
                  E-Mail
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {formErrors.email && <p className="mt-2 text-red-600">{formErrors.email}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Pedido de Autorização de Compra Faturada
                </label>
                <input
                  className="mr-2 leading-tight"
                  id="authorizeFature"
                  name="authorizeFature"
                  type="checkbox"
                  onChange={handleChange}
                  checked={formData.authorizeFature}
                />
                <label className="text-sm" htmlFor="authorizeFature">
                  Quero poder realizar compras faturadas
                </label>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="address">
                  Endereço
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                />
                {formErrors.address && <p className="mt-2 text-red-600">{formErrors.address}</p>}
              </div>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Cadastrar
              </button>
            </form>
          </div>
          <div className="flex justify-between items-center mt-6 text-gray-600">
            <hr className="border-gray-600 w-2/6" />
            <div>Já Possui uma Conta?</div>
            <hr className="border-gray-600 w-2/6" />
          </div>
          <div className="flex justify-center items-center mt-6">
            <Link href="/authentication" className="bg-blue-600 hover:bg-blue-700 text-white text-center font-bold py-2 px-4 rounded w-full block mx-auto">
              Clique Aqui para Entrar
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
