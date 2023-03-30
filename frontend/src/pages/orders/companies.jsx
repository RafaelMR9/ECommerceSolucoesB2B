import Link from "next/link";
import BaseLayout from "../../components/shared/BaseLayout";

export default function CompaniesClientOrders() {
  const orders = [
    { id: 1, name: "A", orderDate: "20/10/2023", expectedDate: "22/10/2023", deliveryDate: "25/10/2023" },
    { id: 2, name: "B", orderDate: "21/10/2023", expectedDate: "23/10/2023", deliveryDate: "26/10/2023" },
    { id: 3, name: "C", orderDate: "22/10/2023", expectedDate: "24/10/2023", deliveryDate: "-" },
    { id: 4, name: "D", orderDate: "23/10/2023", expectedDate: "25/10/2023", deliveryDate: "28/10/2023" },
  ]

  return (
    <BaseLayout>
      <h1 className="text-4xl font-bold text-slate-800 mb-8">Meus Pedidos</h1>
      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Pedidos
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
                <span className="sr-only">Cancelar Pedido</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{order.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-800">{order.orderDate}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-800">{order.expectedDate}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-800">{order.deliveryDate}</div>
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
          Não quer seus Pedidos? <Link href="/" className="text-blue-600">Voltar para a Página Principal</Link>.
        </p>
      </div>
    </BaseLayout>
  )
}
