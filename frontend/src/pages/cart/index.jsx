import ProtectedRoute from "@/components/routes/ProtectedRoute"
import BaseLayout from "@/components/shared/BaseLayout"
import Link from "next/link"
import { AuthContext } from "@/contexts/authContext"
import { getUserProductsInSalesOrder, removeItemSaleOrder, getUserUnfinishedSalesOrder, getUserProductsInSupplierOrder, removeItemSupplierOrder, getUserUnfinishedSupplierOrder, removeSupplierOrder } from "@/services/orderService"
import { getProduct, getProducts, updateProduct } from "@/services/productService"
import { useState, useEffect, useContext } from 'react'
import { getPromotions } from "@/services/marketingService"

export default function Cart() {

  const { user } = useContext(AuthContext)
  const [cartItems, setCartItems] = useState([])
  const [products, setProducts] = useState([])
  const [promotions, setPromotions] = useState([])

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        if (user.is_superuser) {
          const supplierOrder = await getUserUnfinishedSupplierOrder(user.id)
          if (supplierOrder == false)
            return
  
          const cartItems = await getUserProductsInSupplierOrder(supplierOrder.id, user.id)
          setCartItems(cartItems)
        }
        else {
          const salesOrder = await getUserUnfinishedSalesOrder(user.id)
          if (salesOrder == false)
            return
  
          const cartItems = await getUserProductsInSalesOrder(salesOrder.id, user.id)
          setCartItems(cartItems)
        }
        
      } catch (e) {
        alert(e.message)
      }
    }

    const fetchProducts = async () => {
      try {
        const products = await getProducts()
        setProducts(products)
      } catch (e) {
        alert(e.message)
      }
    }

    const fetchPromotions = async () => {
      try {
        const promotions = await getPromotions()
        setPromotions(promotions)
      } catch (e) {
        alert(e.message)
      }
    }

    fetchCartItems()
    fetchProducts()
    fetchPromotions()
  }, [])

  const handlePurchasingOrganizationRemoveItem = async (cartItem, productId) => {
    const product = await getProduct(productId)
    
    await updateProduct(
      { id: productId, 
        currentStockQuantity: product.currentStockQuantity + cartItem.quantity,
        visible: true
      }, productId)
    await removeItemSaleOrder(cartItem.id)
    const salesOrder = await getUserUnfinishedSalesOrder(user.id)
    const cartItems = await getUserProductsInSalesOrder(salesOrder.id, user.id)

    setCartItems(cartItems)
  }

  const handleAdministratorRemoveItem = async (cartItem) => {
    await removeItemSupplierOrder(cartItem.id)
    const supplierOrder = await getUserUnfinishedSupplierOrder(user.id)
    const cartItems = await getUserProductsInSupplierOrder(supplierOrder.id, user.id)

    if (cartItems.length === 0)
      await removeSupplierOrder(supplierOrder.id)

    setCartItems(cartItems)
  }

  const totalPrice = user.is_superuser ? cartItems.reduce((acc, item) => acc + item.costPrice, 0) : cartItems.reduce((acc, item) => acc + item.salePrice, 0)

  return (
    <ProtectedRoute isProtected>
      <BaseLayout>
        <h1 className="text-3xl font-bold text-gray-900 text-center lg:text-start mb-8">Carrinho de Compra</h1>
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg overflow-x-auto">
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
                {cartItems.map((cartItem) => {
                  const now = new Date()
                  const product = products.find(p => p.id === cartItem.product)
                  const promotion = promotions.find(p => p.product === cartItem.product && new Date(p.endDate) >= now && new Date(p.startDate) <= now)
                  return (
                    <tr key={cartItem.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-800">
                          R$ {user.is_superuser ? (product.costPrice).toFixed(2) : promotion ? (promotion.salePrice).toFixed(2) : (product.salePrice).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-800">
                          {cartItem.quantity}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-800">
                          R$ {user.is_superuser ? (cartItem.costPrice).toFixed(2) : (cartItem.salePrice).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-red-600 hover:text-red-700" onClick={() => user.is_superuser? handleAdministratorRemoveItem(cartItem) : handlePurchasingOrganizationRemoveItem(cartItem, product.id)}>
                          Remover
                        </button>
                      </td>
                    </tr>
                )})}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white shadow overflow-hidden rounded-lg flex items-center justify-between border-t border-gray-200 px-4 py-6 mt-6">
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-medium text-gray-900">Total:</h3>
            <h3 className="text-2xl font-medium text-green-900">R$ {totalPrice.toFixed(2)}</h3>
          </div>
          { totalPrice === 0 ?
            <span className="text-gray-600 text-lg">Você deve adicionar pelo menos 1 produto ao carrinho para realizar uma compra.</span>
            :
            <Link href='/purchase/data' className="rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Comprar
            </Link>
          }
        </div>
      </BaseLayout>
    </ProtectedRoute>
  )
}