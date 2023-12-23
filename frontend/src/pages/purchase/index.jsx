import Link from "next/link"
import BaseLayout from "@/components/shared/BaseLayout"
import ProtectedRoute from "@/components/routes/ProtectedRoute"
import { useState, useEffect, useContext } from "react"
import { getProduct, updateProduct } from "@/services/productService"
import { useRouter } from "next/router"
import { getUserUnfinishedSalesOrder, registerItemSalesOrder, registerSalesOrder,
         getUserUnfinishedSupplierOrder, registerItemSupplierOrder, registerSupplierOrder
       } from "@/services/orderService"
import { getProductPromotion } from "@/services/marketingService"
import { checkNullObject } from "@/utils/utils"
import { AuthContext } from "@/contexts/authContext"

export default function Purchase() {

  const router = useRouter()
  const { user } = useContext(AuthContext)
  const { productId } = router.query
  const [product, setProduct] = useState({})
  const [quantity, setQuantity] = useState(0)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await getProduct(productId)
        setProduct(product)
      } catch (e) {
        alert(e.message)
        router.push('/')
      }
    }

    if (user.canPurchase === false)
      router.push('/')
    
    fetchProduct()
  }, [])

  const handleChange = (e) => {
    setQuantity(e.target.value)
    setErrorMessage("")
  }

  const handlePurchasingOrganizationSubmit = async (e) => {
    e.preventDefault()

    if (errorMessage)
      return

    if (product.currentStockQuantity <= 0) {
      setErrorMessage(`Não há estoque do produto suficiente.`)
      return
    }
    else if (product.currentStockQuantity - quantity < 0) {
      setErrorMessage(`Quantidade máxima para compra do produto: ${product.currentStockQuantity}.`)
      return
    }

    try {
      const promotion = await getProductPromotion(productId)
      const product = await getProduct(productId)
      let salesOrder = await getUserUnfinishedSalesOrder(user.id)
      
      if (salesOrder == false)
        salesOrder = await registerSalesOrder({ user: user.id })
      else
        salesOrder = salesOrder.id
      
      await updateProduct(
        { id: product.id, 
          currentStockQuantity: product.currentStockQuantity - quantity,
          visible: true
        }, productId)
      
      await registerItemSalesOrder({
        salePrice: checkNullObject(promotion) ? product.salePrice * quantity : promotion.salePrice * quantity,
        quantity: quantity,
        product: productId,
        salesOrder: salesOrder
      })

      router.push(`/cart`)
    } catch (e) {
      alert(e.message)
    }
    return
  }

  const handleAdministratorSubmit = async (e) => {
    e.preventDefault()

    if (errorMessage)
      return

    try {
      const product = await getProduct(productId)
      let supplierOrder = await getUserUnfinishedSupplierOrder(user.id)
      
      if (supplierOrder == false)
        supplierOrder = await registerSupplierOrder({ user: user.id, supplier: product.supplier })
      else
        supplierOrder = supplierOrder.id
      
      await registerItemSupplierOrder({
        costPrice: product.costPrice * quantity,
        quantity: quantity,
        product: productId,
        supplierOrder: supplierOrder
      })
      
      router.push(`/cart`)
    } catch (e) {
      alert(e.message)
    }
    return
  }

  return (
    <ProtectedRoute isProtected>
      <BaseLayout>
        <h1 className="text-4xl font-bold text-slate-800 text-center md:text-start mb-8">
          Comprar - {product.name}
        </h1>
        <form onSubmit={user.is_superuser ? handleAdministratorSubmit : handlePurchasingOrganizationSubmit}>
          <div className="mb-6">
            <label htmlFor="quantity" className="block text-base font-medium text-gray-700 mb-2">Quantidade</label>
            <input 
              type="number"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"  
              id="quantity" 
              name="quantity"
              value={quantity}
              min={1}
              onChange={handleChange}
            />
            {errorMessage && <p className="mt-2 text-red-600">{errorMessage}</p>}
          </div>
          <button type="submit" className="mb-6 w-full md:w-auto px-6 py-3 rounded-md shadow-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            Adicionar ao Carrinho
          </button>
        </form>
        <hr className="border border-gray-400" />
        <div className="mt-8 text-center">
          { user.is_superuser ?
            <p className="text-gray-700">
              Não quer Reestocar o Produto? <Link href='/restock' className="text-blue-600">Voltar para a Página de Reestoque</Link>.
            </p>
            :
            <p className="text-gray-700">
              Não quer Adiquirir o Produto? <Link href={`/products/${productId}`} className="text-blue-600">Voltar para a Página do Produto</Link>.
            </p>
          }
        </div>
      </BaseLayout>
    </ProtectedRoute>
  )
}