import Link from "next/link"
import BaseLayout from "@/components/shared/BaseLayout"
import ProtectedRoute from "@/components/routes/ProtectedRoute"
import { AuthContext } from "@/contexts/authContext"
import { useEffect, useState, useContext } from "react"

export default function Categories() {


  return (
    <ProtectedRoute isProtected>
      <BaseLayout>
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Pagamento</h1>
        <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-1/2">
          <div class="mb-4">
            <label class="block text-gray-700 text-lg font-bold mb-2" for="cardNumber">
              Número do cartão
            </label>
            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="cardNumber" type="text" placeholder="Digite somente números"/>
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 text-lg font-bold mb-2" for="cardName">
              Nome Impresso no Cartão
            </label>
            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="cardName" type="text" placeholder="Digite o nome impresso no cartão"/>
          </div>

          <div class="mb-4 flex justify-between">
            <div class="mr-2">
              <label class="block text-gray-700 text-lg font-bold mb-2" for="cardValidity">
                Validade
              </label>
              <div className="flex gap-2">
                <div class="relative">
                  <select class="shadow block appearance-none w-full border border-gray-200 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="cardValidity">
                    <option>07</option>
                    <option>08</option>
                  </select>
                </div>
                <div class="relative">
                  <select class="shadow block appearance-none w-full border border-gray-200 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="cardValidity">
                    <option>2023</option>
                    <option>2022</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="ml-2">
              <label class="block text-gray-700 text-lg font-bold mb-2" for="cardCVV">
                Código de segurança
              </label>
              <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="cardCVV" type="text" placeholder="CVV"/>
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 text-lg font-bold mb-2" for="installments">
              Parcelamento
            </label>
            <div class="relative">
              <select class="shadow block appearance-none w-full border border-gray-200 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="installments">
                <option>1x de R$ 97,00</option>
              </select>
            </div>
          </div>
          <button class="bg-blue-600 hover:bg-blue-700 block w-full text-white text-xl font-bold py-4 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            Comprar
          </button>
        </form>
      </BaseLayout>
    </ProtectedRoute>
  )
}