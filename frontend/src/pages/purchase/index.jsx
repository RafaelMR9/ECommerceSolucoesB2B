import Link from "next/link"
import BaseLayout from "@/components/shared/BaseLayout"
import ProtectedRoute from "@/components/routes/ProtectedRoute"
import { useState, useEffect } from "react"
import { getProduct } from "@/services/productService"
import { useRouter } from "next/router"

export default function Purchase() {

  const router = useRouter()
  const { productId } = router.query
  const [product, setProduct] = useState({})
  const [quantity, setQuantity] = useState(0)

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

  return (
    <ProtectedRoute isProtected>
      <BaseLayout>
        <h1 className="text-4xl font-bold text-slate-800 mb-8">
          Comprar - {product.name}
        </h1>
        <form>
          <div className="mb-6">
            <label htmlFor="quantity" className="block text-base font-medium text-gray-700 mb-2">Quantidade</label>
            <input 
              type="number"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"  
              id="quantity" 
              name="quantity"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
            />
          </div>
          <button type="submit" className="px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600">
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