import Link from "next/link"
import BaseLayout from "@/components/shared/BaseLayout"
import ProtectedRoute from "@/components/routes/ProtectedRoute"

export default function Orders() {
  return (
    <ProtectedRoute isProtected isAdminOnly>
      <BaseLayout>
        <h1 className="text-4xl font-bold text-slate-800 mb-8">Pagamentos</h1>
        <div className="grid grid-cols-2 gap-64 text-center text-2xl">
          <Link href="/payments/recurring-payments" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 rounded">
            Recorrentes
          </Link>
          <Link href="/payments/non-recurring-payments" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 rounded">
            Não Recorrentes
          </Link>
        </div>
        <hr className="mt-6 border border-gray-400" />
        <div className="mt-8 text-center">
          <p className="text-gray-700">
            Não quer Checar os Pagamentos? <Link href="/" className="text-blue-600">Voltar para a Página Principal</Link>.
          </p>
        </div>
      </BaseLayout>
    </ProtectedRoute>
  )
}
