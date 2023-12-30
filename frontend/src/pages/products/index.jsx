import Link from "next/link"
import BaseLayout from "@/components/shared/BaseLayout"
import ProtectedRoute from "@/components/routes/ProtectedRoute"
import { AuthContext } from "@/contexts/authContext"
import { useState, useEffect, useContext } from "react"
import { getProducts, filterProductsByName, filterProductsByCategory, getCategories } from "@/services/productService"
import { getPromotions } from "@/services/marketingService"
import { useRouter } from "next/router"

export default function Products() {

  const router = useRouter()
  const queryParams = router.query
  const { user } = useContext(AuthContext)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [promotions, setPromotions] = useState([])
  const [message, setMessage] = useState("")

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let products = []

        if (queryParams.categoryId) {
          products = await filterProductsByCategory(queryParams.categoryId)
          if (products.length === 0)
            setMessage(`Não existem produtos na categoria pesquisada.`)
        }
        else if (queryParams.fetchProduct) {
          products = await filterProductsByName(queryParams.fetchProduct)
          
          setMessage("")
          
          if (products.length === 0)
            setMessage(`Nenhum resultado para a busca '${queryParams.fetchProduct}'.`)
        }
        else {
          products = await getProducts()
          if (products.length === 0)
            setMessage(`Ainda não existem produtos cadastrados.`)
        }

        setProducts(products)
      } catch (e) {
        alert(e.message)
      }
    }

    const fetchCategories = async () => {
      try {
        const categories = await getCategories()
        setCategories(categories)
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

    fetchProducts()
    fetchCategories()
    fetchPromotions()
  }, [queryParams])

  const handleResetSearch = async () => {
    try {
      const products = await getProducts()

      setMessage("")
      if (categories.length === 0) {
        setMessage(`Ainda não existem produtos cadastrados.`)
      }
      setProducts(products)
    } catch (e) {
      alert(e.message)
    }
  }

  const findCategoryName = (categoryId) => {
    const category = categories.find(category => category.id === categoryId)
    return category ? category.name : ''
  }

  return (
    <ProtectedRoute isProtected>
      <BaseLayout>
        <div className="flex flex-col lg:flex-row flex-wrap items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Produtos</h1>
          <div className="flex flex-col lg:flex-row flex-wrap justify-center lg:justify-start gap-2 lg:gap-4 w-full lg:w-auto">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md" onClick={handleResetSearch}>
              Resetar Busca
            </button>
            {(user && user.is_superuser) &&
              <Link href="/products/register" className="hover:bg-blue-600 hover:text-white border-2 border-blue-600 text-blue-600 transition duration-200 flex items-center justify-center font-bold py-2 px-4 sm:px-8 rounded focus:outline-none focus:shadow-outline">
                Cadastrar Produto
              </Link>
            }
          </div>
        </div>
        {message && <p className="text-red-600 font-semibold text-lg mb-2">{message}</p>}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => {
            const now = new Date();
            const promotion = promotions.find((promotion) => promotion.product === product.id && new Date(promotion.endDate) >= now && new Date(promotion.startDate) <= now);

            return (
              <div key={product.id} className="flex flex-col justify-between bg-white rounded-lg shadow-lg p-4 h-full">
                <div>
                  <img
                    src={product.image}
                    alt="Produto"
                    className="object-contain h-56 w-full rounded-lg mb-4"
                  />
                  <hr className="border-2 border-slate-200 mb-2" />
                  <h2 className="text-xl font-bold mb-2">{product.name}</h2>
                  <p className="text-gray-600 text-lg font-semibold mb-2">
                    Categoria: <Link href={`/products?categoryId=${product.category}`} className="text-blue-800 hover:underline">{findCategoryName(product.category)}</Link>
                  </p>
                </div>
                <div>
                  {promotion ? (
                    <p className="mb-4">
                      <span className="text-gray-800 font-bold text-xl line-through">R$ {product.salePrice.toFixed(2)}</span>
                      <span className="text-green-800 font-bold text-xl "> R$ {promotion.salePrice.toFixed(2)}</span>
                    </p>
                  ) : (
                    <p className="text-gray-800 font-bold text-xl mb-4">R$ {product.salePrice.toFixed(2)}</p>
                  )}
                  <Link href={`/products/${product.id}`} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Mais Informações
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </BaseLayout>
    </ProtectedRoute>
  )
}