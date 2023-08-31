import ProtectedRoute from "@/components/routes/ProtectedRoute"
import BaseLayout from "@/components/shared/BaseLayout"
import { getUsers, updateUser } from "@/services/userService"
import { useEffect, useState } from "react"

export default function CreditAnalysis() {

  const [companies, setCompanies] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let companies = await getUsers()
        companies = companies.filter((user) => user.authorizeFature === false)
        setCompanies(companies)
      } catch (e) {
        alert(e.message)
      }
    }

    fetchUsers()
  }, [])

  const handleAuthorizeUser = async (user) => {
    try {
      await updateUser(
        { ...user, authorizeFature: true }, 
        user.id, 
        user.username
      )
    } catch (e) {
      alert(e)
    }
  }

  const handleDontAuthorizeUser = async (user) => {
    try {
      await updateUser(
        { ...user, authorizeFature: null }, 
        user.id, 
        user.username
      )
    } catch (e) {
      alert(e)
    }
  }

  return (
    <ProtectedRoute isProtected isAdminOnly>
      <BaseLayout>
        <h1 className="text-4xl font-bold text-slate-800 mb-8">Análise de Créditos</h1>
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  CNPJ
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Permitir</span>
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Não Permitir</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {companies.map((company) => (
                <tr key={company.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {company.cnpj}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-700" onClick={handleAuthorizeUser}>
                      Permitir
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-red-600 hover:text-red-700" onClick={handleDontAuthorizeUser}>
                      Não Permitir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </BaseLayout>
    </ProtectedRoute>
  )
}
