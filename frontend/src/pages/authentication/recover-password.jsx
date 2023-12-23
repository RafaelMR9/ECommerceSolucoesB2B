import ProtectedRoute from "@/components/routes/ProtectedRoute"
import { useState, useEffect } from 'react'
import { useRouter } from "next/router"
import { removePasswordToken, checkPasswordTokenExistence, resetPassword } from '@/services/authService'
import { validatePassword, validateConfirmPassword } from "@/utils/utils"
import { getUserIdByEmail } from "@/services/userService"

export default function RecoverPassword() {
  
  const router = useRouter()
  const { token, isReady, email } = router.query

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })
  const [formErrors, setFormErrors] = useState({
    password: "",
    confirmPassword: ""
  })

  useEffect(() => {
    const fetchToken = async () => {
      if (!token) {
        router.push('/authentication')
        return
      }
      else {
        try {
          const data = await checkPasswordTokenExistence(token)
          if (!data.status) {
            router.push('/authentication')
            return
          }
          else (data.status) 
            await removePasswordToken(data.id)
        } catch (e) {
          alert(e.message)
        }
      }
    }

    const url = new URL(window.location.href)
    if (isReady)
      fetchToken()
    else if (!url.searchParams.has('isReady'))
      router.push('/authentication')

  }, [token, isReady])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevStateData) => ({
      ...prevStateData,
      [name]: value,
    }))

    setFormErrors((prevErrors) => {
      const errors = { ...prevErrors }
      if (name === 'password')
        errors.password = ''
      if (name === 'confirmPassword')
        errors.confirmPassword = ''
      return errors
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const errors = { ...formErrors }
    if (formData.password && !validatePassword(formData.password))
      errors.password = 'Senha deve possuir pelo menos 8 caracteres e possuir letras.'
    if (formData.confirmPassword && !validateConfirmPassword(formData.password, formData.confirmPassword))
      errors.confirmPassword = 'Senhas não coincidem.'

    if (Object.values(errors).some(value => value !== "")) {
      setFormErrors(errors)
      return
    }

    try {
      const data = await getUserIdByEmail(email)
      await resetPassword(formData, data.id)
      router.push('/authentication')
    } catch (e) {
      const errorObj = JSON.parse(e.message)
      setFormErrors(errorObj)
    }
  }

  return (
    <ProtectedRoute isAuthPage>
      <div className="bg-gray-100 min-h-screen">
        <div className="mx-auto max-w-lg py-20 px-5 sm:px-0">
          <div className="bg-white shadow-md rounded px-8 py-10">
            <h1 className="text-3xl text-gray-900 font-bold text-center mb-8">Redefinição de Senha</h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
                  Senha
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  value={formData.password}
                  name="password"
                  onChange={handleChange}
                  required
                />
                {formErrors.password && <p className="mt-2 text-red-600">{formErrors.password}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="confirmPassword">
                  Confirmar Senha
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  name="confirmPassword"
                  onChange={handleChange}
                  required
                />
                {formErrors.confirmPassword && <p className="mt-2 text-red-600">{formErrors.confirmPassword}</p>}
              </div>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Atualizar
              </button>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
