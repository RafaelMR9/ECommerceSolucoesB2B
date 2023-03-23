import Link from "next/link";
import BaseLayout from "../../components/shared/BaseLayout";
import { useState } from 'react';

export default function PurchaseData() {
  const [formData, setFormData] = useState({
    deliveryFuture: "",
    deliveryDate: '',
    recurrencePeriod: '',
    paymentDate: '',
    paymentMethod: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }))
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    console.log(formData)
    // implementar lógica de compra aqui
  }

  return (
    <BaseLayout>
      <h1 className="text-4xl font-bold text-slate-800 mb-8">Dados de Pagamento</h1>
      <form onSubmit={handleFormSubmit}>
        <div className="mb-4">
          <label htmlFor="deliveryFutureYes" className="block text-base font-medium text-gray-700 mb-2">
            Entrega Futura
          </label>
          <div className="flex items-center gap-6">
            <div>
              <input
                type="radio"
                id="deliveryFutureYes"
                name="deliveryFuture"
                className="mr-2"
                value="true"
                checked={formData.deliveryFuture === "true"}
                onChange={handleInputChange}
              />
              <label htmlFor="deliveryFutureYes" className="text-gray-700">
                Sim
              </label>
            </div>
            <div>
              <input
                type="radio"
                id="deliveryFutureNo"
                name="deliveryFuture"
                className="mr-2"
                value="false"
                checked={formData.deliveryFuture === "false"}
                onChange={handleInputChange}
              />
              <label htmlFor="deliveryFuture" className="text-gray-700">
                Não
              </label>
            </div>
          </div>
        </div>
        {formData.deliveryFuture === "true" && (
          <>
            <div className="mb-4">
              <label htmlFor="deliveryDate" className="block text-base font-medium text-gray-700 mb-2">
                Data da Entrega
              </label>
              <input
                type="date"
                id="deliveryDate"
                name="deliveryDate"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={formData.deliveryDate}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="recurrencePeriod" className="block text-base font-medium text-gray-700 mb-2">
                Periodicidade da Recorrência
              </label>
              <input
                type="number"
                id="recurrencePeriod"
                name="recurrencePeriod"
                step="1"
                min="1"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={formData.recurrencePeriod}
                onChange={handleInputChange}
              />
            </div>
          </>
        )}
        <div className="mb-4">
          <label htmlFor="paymentDate" className="block text-base font-medium text-gray-700 mb-2">
            Data Solicitada para Pagamento
          </label>
          <input
            type="date"
            id="paymentDate"
            name="paymentDate"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={formData.paymentDate}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="paymentMethod" className="block text-base font-medium text-gray-700 mb-2">
            Forma de Pagamento
          </label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={handleInputChange}
            value={formData.paymentMethod}
          >
            <option value="" disabled>Selecione uma forma de pagamento</option>
            <option value="creditCard">Cartão de Crédito</option>
            <option value="debitCard">Cartão de Débito</option>
            <option value="boleto">Boleto Bancário</option>
          </select>
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
        >
          Finalizar Compra
        </button>
      </form>
      <hr className="mt-6 border border-gray-400" />
      <div className="mt-8 text-center">
        <p className="text-gray-700">
          Não quer Atualizar Comprar este Produto ou quer Mudar a Quantidade? <Link href="/purchase" className="text-blue-600">Voltar para a Página de Compra</Link>.
        </p>
      </div>
    </BaseLayout>
  )
}