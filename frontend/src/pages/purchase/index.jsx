import Link from "next/link"
import BaseLayout from "@/components/shared/BaseLayout"
import ProtectedRoute from "@/components/routes/ProtectedRoute"
import { useState, useEffect, useContext } from "react"
import { getProduct, updateProduct } from "@/services/productService"
import { useRouter } from "next/router"
import { getUserUnfinishedSalesOrder, registerItemSalesOrder, registerSalesOrder } from "@/services/orderService"
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
      }
    }

    fetchProduct()
  }, [])

  const handleChange = (e) => {
    setQuantity(e.target.value)
    setErrorMessage("")
  }

  const handleSubmit = async (e) => {
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
      let saleOrder = await getUserUnfinishedSalesOrder(user.id)

      if (saleOrder == false) {
        saleOrder = await registerSalesOrder({
          cancelled: false,
          faturedPayment: false,
          finished: false,
          totalSaleValue: 0,
          deliveryFrequency: null,
          user: user.id
        })
      }

      await updateProduct(
        { id: product.id, 
          currentStockQuantity: product.currentStockQuantity - quantity,
          visible: true
        }, productId)

      await registerItemSalesOrder({
        salePrice: checkNullObject(promotion) ? product.salePrice * quantity : promotion.salePrice * quantity,
        quantity: quantity,
        product: productId,
        salesOrder: saleOrder
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
        <h1 className="text-4xl font-bold text-slate-800 mb-8">
          Comprar - {product.name}
        </h1>
        <form onSubmit={handleSubmit}>
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
          <button type="submit" className="mb-6 px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600">
            Adicionar ao Carrinho
          </button>
        </form>
        <hr className="border border-gray-400" />
        <div className="mt-8 text-center">
          <p className="text-gray-700">
            Não quer Adiquirir o Produto? <Link href={`/products/${productId}`} className="text-blue-600">Voltar para a Página do Produto</Link>.
          </p>
        </div>
      </BaseLayout>
    </ProtectedRoute>
  )
}