import Link from "next/link"
import { useContext } from 'react'
import { AuthContext } from "@/contexts/authContext"
import { logoutUser } from '@/services/authService'
import { useRouter } from 'next/router'
import ProtectedRoute from "@/components/routes/ProtectedRoute"
import BaseLayout from "@/components/shared/BaseLayout"

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
        <h1 className="text-4xl font-bold text-slate-800 text-center lg:text-start mb-8">
          Meu Perfil
        </h1>
        <div className={`grid ${ authContext.user && authContext.user.is_superuser ? 'lg:grid-cols-2' : 'lg:grid-cols-4' } gap-8`}>
          { authContext.user && authContext.user.is_superuser ?
            <div className="rounded overflow-hidden shadow-lg">
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
              <div className="rounded overflow-hidden shadow-lg">
                <div className="h-24 bg-blue-600"/>
                <div className="flex flex-col justify-center items-center px-6 py-4">
                  <div className="text-lg font-bold text-slate-800 mb-2">Nome</div>
                  <p className="text-gray-700 text-base">
                    { authContext.user && authContext.user.name }
                  </p>
                </div>
              </div>
              <div className="rounded overflow-hidden shadow-lg">
                <div className="h-24 bg-blue-600"/>
                <div className="flex flex-col justify-center items-center px-6 py-4">
                  <div className="text-lg font-bold text-slate-800 mb-2">CNPJ</div>
                  <p className="text-gray-700 text-base">
                    { authContext.user && authContext.user.cnpj }
                  </p>
                </div>
              </div>
              <div className="rounded overflow-hidden shadow-lg">
                <div className="h-24 bg-blue-600"/>
                <div className="flex flex-col justify-center items-center px-6 py-4">
                  <div className="text-lg font-bold text-slate-800 mb-2">Endereço</div>
                  <p className="text-gray-700 text-base">
                    { authContext.user && authContext.user.address }
                  </p>
                </div>
              </div>
            </>
          }
          <div className="rounded overflow-hidden shadow-lg">
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
              className="hover:bg-red-600 hover:text-white border-2 border-red-600 text-red-600 transition duration-200 font-bold py-4 px-16 rounded focus:outline-none focus:shadow-outline">
              Sair
            </button>
        </div>
      </BaseLayout>
    </ProtectedRoute>
  )
}