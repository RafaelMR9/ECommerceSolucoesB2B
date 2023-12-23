import Link from "next/link"
import ProtectedRoute from "@/components/routes/ProtectedRoute"
import BaseLayout from "@/components/shared/BaseLayout"
import { useState, useEffect, useContext } from 'react'
import { getProducts } from "@/services/productService"
import { getSuppliers } from "@/services/supplierService"
import { getUserUnfinishedSupplierOrder, getUserSupplierOrder } from "@/services/orderService"
import { AuthContext } from "@/contexts/authContext"

export default function RegisterPromotion() {
  
  const { user } = useContext(AuthContext)
  const [products, setProducts] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [order, setOrder] = useState({})

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getProducts()

        setProducts(products)
      } catch (e) {
        alert(e.message)
      }
    }

    const fetchSuppliers = async () => {
      try {
        const suppliers = await getSuppliers()

        setSuppliers(suppliers)
      } catch (e) {
        alert(e.message)
      }
    }
    
    const fetchOrder = async () => {
      try {
        const order = await getUserUnfinishedSupplierOrder(user.id)

        if (Array.isArray(order)) 
          return

        setOrder(order)
      } catch (e) {
        alert(e.message)
      }
    }

    fetchProducts()
    fetchSuppliers()
    fetchOrder()
  }, [])
  
  return (
    <ProtectedRoute isProtected isAdminOnly>
      <BaseLayout>
        <h1 className="text-4xl font-bold text-slate-800 text-center lg:text-start mb-8">Ressuprimento de Produtos</h1>
        {Array.from(new Set(products.map(product => product.supplier))).map(supplierId => {
          const supplier = suppliers.find(s => s.id === supplierId)
          if (supplier) {
            return (
            <div key={supplier.id} className="mb-6">
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">{supplier.name}</h2>
              <div className="bg-white shadow-md rounded-md overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Produto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantidade em Estoque
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Preço de Custo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"/>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products
                      .filter(product => product.supplier === supplier.id)
                      .map(product => {
                        const isSameSupplier = order.supplier === product.supplier

                        return (
                          <tr key={product.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {product.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {product.currentStockQuantity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              R$ {product.costPrice.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {isSameSupplier || Object.keys(order).length === 0 ? 
                                <Link href={`/purchase?productId=${product.id}`} className="bg-blue-600 hover:bg-blue-700 px-6 py-2 text-white font-bold rounded focus:outline-none focus:shadow-outline">
                                  Comprar
                                </Link>
                                :
                                <span className="text-gray-800">-</span>
                              }
                            </td>
                          </tr>
                        )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        })}
        <hr className="mt-6 border border-gray-400" />
        <div className="mt-8 text-center">
          <p className="text-gray-700">
            Não quer Reestocar seus Produtos? <Link href='/' className="text-blue-600">Voltar para a Página Principal</Link>.
          </p>
        </div>
      </BaseLayout>
    </ProtectedRoute>
  )
}