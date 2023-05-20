import Link from "next/link"
import BaseLayout from "@/components/shared/BaseLayout"

export default function SuppliersOrders() {
  const suppliers = [
    { id: 1, cnpj: "00.000.000/0001-1", orderDate: "20/10/2023", expectedDate: "22/10/2023", deliveryDate: "25/10/2023" },
    { id: 2, cnpj: "00.000.000/0001-2", orderDate: "21/10/2023", expectedDate: "23/10/2023", deliveryDate: "26/10/2023" },
    { id: 3, cnpj: "00.000.000/0001-3", orderDate: "22/10/2023", expectedDate: "24/10/2023", deliveryDate: "-" },
    { id: 4, cnpj: "00.000.000/0001-4", orderDate: "23/10/2023", expectedDate: "25/10/2023", deliveryDate: "28/10/2023" },
  ]

  return (
    <BaseLayout>
      <h1 className="text-4xl font-bold text-slate-800 mb-8">Pedidos dos Fornecedores</h1>
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
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Realização do Pedido
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Previsão de Entrega
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Realização da Entrega
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Recebido</span>
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Não Recebido</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {suppliers.map((supplier) => (
              <tr key={supplier.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {supplier.cnpj}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-800">
                    {supplier.orderDate}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-800">
                    {supplier.expectedDate}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-800">
                    {supplier.deliveryDate}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-700">
                    Recebido
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-red-600 hover:text-red-700">
                    Não Recebido
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
          Não quer Analisar os Pedidos dos Fornecedores? <Link href="/orders" className="text-blue-600">Voltar para a Página de Pedidos</Link>.
        </p>
      </div>
    </BaseLayout>
  )
}
