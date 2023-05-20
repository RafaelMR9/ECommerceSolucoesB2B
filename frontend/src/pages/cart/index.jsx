import BaseLayout from "@/components/shared/BaseLayout"
import { useState } from 'react'

export default function Cart() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Produto 1',
      price: 19.99,
      quantity: 2
    },
    {
      id: 2,
      name: 'Produto 2',
      price: 29.99,
      quantity: 1
    }
  ])

  function handleRemoveItem(id) {
    const newCartItems = cartItems.filter(item => item.id !== id);
    setCartItems(newCartItems);
  }

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return (
    <BaseLayout>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Carrinho de Compra</h1>
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider"
                >
                  Produtos no Carrinho
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Preço Unitário
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Quantidade
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Preço Total
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Remover</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cartItems.map((cartItem) => (
                <tr key={cartItem.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {cartItem.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-800">
                      R$ {cartItem.price}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-800">
                      {cartItem.quantity}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-800">
                      R$ {(cartItem.price * cartItem.quantity).toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-red-600 hover:text-red-700" onClick={() => handleRemoveItem(cartItem.id)}>
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-white shadow overflow-hidden rounded-lg flex items-center justify-between border-t border-gray-200 px-4 py-6 mt-6">
        <div className="flex items-center gap-2">
          <h3 className="text-2xl font-medium text-gray-900">Total:</h3>
          <h3 className="text-2xl font-medium text-green-900">R${totalPrice.toFixed(2)}</h3>
        </div>
        <button className="rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Comprar
        </button>
      </div>
    </BaseLayout>
  )
}