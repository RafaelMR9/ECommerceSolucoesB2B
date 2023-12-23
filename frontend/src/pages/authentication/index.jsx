import Link from 'next/link'
import { useContext, useState } from 'react'
import { AuthContext } from '@/contexts/authContext'
import { loginUser } from '@/services/authService'
import { useRouter } from 'next/router'
import ProtectedRoute from '@/components/routes/ProtectedRoute'

export default function Login() {
  const authContext = useContext(AuthContext)
  const router = useRouter()

  const [formData, setFormData] = useState({ 
    username: '', 
    password: '' 
  })

  const [formErrors, setFormErrors] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevStateData) => ({
      ...prevStateData,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormErrors("")
    try {
      await loginUser(formData, authContext)
      router.push('/')
    } catch(e) {
      const errorObj = JSON.parse(e.message)
      setFormErrors(errorObj.detail)
    }
  }

  return (
    <ProtectedRoute isAuthPage>
      <div className="bg-gray-100 min-h-screen">
        <div className="mx-auto max-w-lg py-20 px-5 sm:px-0">
          <div className="bg-white shadow-md rounded px-8 py-10">
            <h1 className="text-3xl text-gray-900 font-bold text-center mb-8">Fazer Login</h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="username">
                  Usuário
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
                  Senha
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              { formErrors && <p className="mb-4 text-red-600">{formErrors}</p>}
              <div className="flex items-center justify-between">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Entrar
                </button>
                <Link href="/authentication/forgot-password" className="inline-block align-baseline font-bold text-sm text-blue-600 hover:text-blue-800">
                  Esqueci Minha Senha
                </Link>
              </div>
            </form>
          </div>
          <div className="flex justify-between items-center mt-6 text-gray-600">
            <hr className="border-gray-600 w-2/6" />
            <span>Novo por Aqui?</span>
            <hr className="border-gray-600 w-2/6" />
          </div>
          <div className="flex justify-center items-center mt-6">
            <Link href="/authentication/register-account" className="bg-blue-600 hover:bg-blue-700 text-white text-center font-bold py-2 px-4 rounded w-full block mx-auto">
              Cadastre Sua Conta
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}