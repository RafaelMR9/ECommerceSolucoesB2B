import Link from "next/link"
import { useContext } from 'react'
import BaseLayout from "../../components/shared/BaseLayout"
import { AuthContext } from "@/contexts/authContext"
import ProtectedRoute from "@/components/routes/ProtectedRoute"
import { logoutUser } from '@/services/authService'
import { useRouter } from 'next/router'

export default function Profile() {
  const authContext = useContext(AuthContext)
  const router = useRouter()

  const handleLogout = async (e) => {
    logoutUser(authContext)
    router.push('/authentication')
  }

  return (
    <ProtectedRoute isProtected>
      <BaseLayout>
        <h1 className="text-3xl font-bold text-slate-800 mb-8">
          Meu Perfil
        </h1>
        <div className={`grid grid-cols-1 ${ authContext.user && authContext.user.eAdministrador ? 'lg:grid-cols-2' : 'lg:grid-cols-3' } gap-8`}>
          { authContext.user && authContext.user.eAdministrador ?
            <div className="max-w-sm rounded overflow-hidden shadow-lg">
              <div className="h-24 bg-blue-600"/>
              <div className="flex flex-col justify-center items-center px-6 py-4">
                <div className="text-lg font-bold text-slate-800 mb-2">CPF</div>
                <p className="text-gray-700 text-base">
                  { authContext.user && authContext.user.cpf }
                </p>
              </div>
            </div>
            :
            <>
              <div className="max-w-sm rounded overflow-hidden shadow-lg">
                <div className="h-24 bg-blue-600"/>
                <div className="flex flex-col justify-center items-center px-6 py-4">
                  <div className="text-lg font-bold text-slate-800 mb-2">CNPJ</div>
                  <p className="text-gray-700 text-base">
                    { authContext.user && authContext.user.cnpj }
                  </p>
                </div>
              </div>
              <div className="max-w-sm rounded overflow-hidden shadow-lg">
                <div className="h-24 bg-blue-600"/>
                <div className="flex flex-col justify-center items-center px-6 py-4">
                  <div className="text-lg font-bold text-slate-800 mb-2">Endereço</div>
                  <p className="text-gray-700 text-base">
                    { authContext.user && authContext.user.endereco }
                  </p>
                </div>
              </div>
            </>
          }
          <div className="max-w-sm rounded overflow-hidden shadow-lg">
            <div className="h-24 bg-blue-600"/>
            <div className="flex flex-col justify-center items-center px-6 py-4">
              <div className="text-lg font-bold text-slate-800 mb-2">E-Mail</div>
              <p className="text-gray-700 text-base">
                { authContext.user && authContext.user.email }
              </p>
            </div>
          </div>
        </div>
        <hr className="my-16 border- border-gray-400"/>
        <div className="flex justify-around items-center">
            <Link href="/profile/update" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded focus:outline-none focus:shadow-outline">
              Editar Dados de Cadastro
            </Link>
            <button 
              onClick={handleLogout}
              className="hover:bg-white border-2 border-red-600 text-red-600 font-bold py-4 px-16 rounded focus:outline-none focus:shadow-outline">
              Sair
            </button>
        </div>
      </BaseLayout>
    </ProtectedRoute>
  )
}