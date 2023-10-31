import Link from "next/link"
import BaseLayout from "@/components/shared/BaseLayout"
import ProtectedRoute from "@/components/routes/ProtectedRoute"
import { AuthContext } from "@/contexts/authContext"
import { useContext } from "react"

export default function Orders() {
  
  const { user } = useContext(AuthContext)

  return (
    <ProtectedRoute isProtected>
      <BaseLayout>
        <h1 className="text-4xl font-bold text-slate-800 mb-8">Pedidos</h1>
        <div>
        {user.is_superuser ?
          <div className="grid grid-cols-3 gap-4 text-center text-2xl">
            <Link href="/orders/adm-recurring-orders" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 rounded">
              Recorrentes
            </Link>
            <Link href="/orders/adm-non-recurring-orders" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 rounded">
              Não Recorrentes
            </Link>
            <Link href="/orders/suppliers-orders" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 rounded">
              Fornecedores
            </Link>
          </div>
          : 
          <div className="grid grid-cols-2 gap-64 text-center text-2xl">
            <Link href="/orders/recurring-orders" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 rounded">
              Recorrentes
            </Link>
            <Link href="/orders/non-recurring-orders" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 rounded">
              Não Recorrentes
            </Link>
          </div>
        }
        </div>
        <hr className="mt-6 border border-gray-400" />
        <div className="mt-8 text-center">
          <p className="text-gray-700">
            Não quer Ver os Pedidos? <Link href="/" className="text-blue-600">Voltar para a Página Principal</Link>.
          </p>
        </div>
      </BaseLayout>
    </ProtectedRoute>
  )
}
