import BaseLayout from "../../components/shared/BaseLayout";
import { useState } from 'react';

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
        <div className="px-4 py-5">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Produtos no Carrinho
          </h3>
        </div>
        <div className="border-t border-gray-200 px-4">
          {cartItems.map((item, index) => (
            <div key={item.id} className={`flex items-center py-4 ${index !== cartItems.length - 1 ? 'border-b border-gray-300' : ''}`}>
              <div className="flex-1">
                <h4 className="text-lg font-medium text-gray-900">{item.name}</h4>
                <p className="text-md text-gray-500">{item.price.toFixed(2)} x {item.quantity}</p>
              </div>
              <button onClick={() => handleRemoveItem(item.id)} className="ml-4 bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded">
                Remover
              </button>
            </div>
          ))}
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