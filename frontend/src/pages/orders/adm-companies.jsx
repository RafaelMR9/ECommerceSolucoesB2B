import Link from "next/link";
import BaseLayout from "../../components/shared/BaseLayout";

export default function CompaniesOrders() {
  const companies = [
    { id: 1, cnpj: "00.000.000/0001-01" },
    { id: 2, cnpj: "00.000.000/0001-02" },
    { id: 3, cnpj: "00.000.000/0001-03" },
    { id: 4, cnpj: "00.000.000/0001-04" },
  ]

  return (
    <BaseLayout>
      <h1 className="text-4xl font-bold text-slate-800 mb-8">Pedidos dos Clientes</h1>
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
                <span className="sr-only">Enviar</span>
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Não Enviar</span>
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Cancelar Pedido</span>
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
                  <button className="text-blue-600 hover:text-blue-700">
                    Enviar
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-red-600 hover:text-red-700">
                    Não Enviar
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-red-600 hover:text-red-700">
                    Cancelar Pedido
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <hr className="mt-6 border border-gray-400" />
      <div className="mt-8 text-center">
        <p className="text-gray-700">
          Não quer Analisar os Pedidos dos Clientes? <Link href="/orders" className="text-blue-600">Voltar para a Página de Pedidos</Link>.
        </p>
      </div>
    </BaseLayout>
  )
}
