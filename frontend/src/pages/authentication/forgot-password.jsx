import ProtectedRoute from '@/components/routes/ProtectedRoute'
import Link from 'next/link'
import { sendResetPasswordEmail } from '@/services/authService'
import { useState } from 'react'
import { validateEmail } from '@/utils/utils'

export default function ForgotPassword() {

  const [email, setEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [response, setResponse] = useState({})
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    let error = ''
    if (email && !validateEmail(email))
      error = 'E-Mail inválido.'

    if (error) {
      setErrorMessage(error)
      return
    }

    setLoading(true)
    setResponse({})

    try {
      const data = await sendResetPasswordEmail(email)
      setResponse(data)
    } catch (e) {
      alert(e)
    }

    setLoading(false)
  }

  return (
    <ProtectedRoute isAuthPage>
      <div className="bg-gray-100 min-h-screen">
        <div className="mx-auto max-w-lg py-20">
          <div className="bg-white shadow-md rounded px-8 py-10">
            <h1 className="text-3xl text-gray-900 font-bold text-center mb-8">Recuperação de Conta</h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
                  E-Mail
                </label>
                <input
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (validateEmail(e.target.value)) setErrorMessage(''); }}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  required
                />
                {errorMessage && <p className='text-red-600 mt-2 mb-4'>{errorMessage}</p>}
              </div>
              {response.message && <p className={response.status === 'error' ? 'text-red-600 mb-4' : 'text-green-600 mb-4'}>{response.message}</p>}
              { loading ? 
                <div>
                  <p className="text-gray-700 font-semibold leading-tight mb-4">Este processo pode levar em torno de 20 segundos...</p>
                  <div className="flex items-center justify-center">
                    <div className={`animate-spin ease-linear rounded-full h-24 w-24 pt-14 border-8 border-l-gray-400 border-r-gray-400 border-b-gray-400 border-t-indigo-900`}/>
                  </div>
                </div>
                :
                <div className="flex items-center justify-between">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                  >
                    Enviar
                  </button>
                  <Link href="/authentication" className="inline-block align-baseline font-bold text-blue-600 hover:text-blue-800">Voltar</Link>
                </div>
              }
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
