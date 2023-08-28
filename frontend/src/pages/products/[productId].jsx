import Link from "next/link"
import BaseLayout from "@/components/shared/BaseLayout"
import ProtectedRoute from "@/components/routes/ProtectedRoute"
import Modal from "@/components/shared/Modal"
import { AuthContext } from "@/contexts/authContext"
import { useState, useEffect, useContext } from "react"
import { getProduct, getCategory, removeProduct } from "@/services/productService"
import { useRouter } from "next/router"

export default function Product() {

  const router = useRouter()
  const { user } = useContext(AuthContext)
  const { productId } = router.query
  const [product, setProduct] = useState({})
  const [category, setCategory] = useState({})
  const [modalState, setModalState] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await getProduct(productId)
        const category = await getCategory(product.category)
        setProduct(product)
        setCategory(category)
      } catch (e) {
        alert(e.message)
      }
    }

    fetchProduct()
  }, [])

  const handleRemoveProduct = async (product) => {
    try {
      await removeProduct(product)
      router.push('/products')
    } catch (e) {
      alert(e)
    }
    setModalState({})
  }

  return (
    <ProtectedRoute isProtected>
      <BaseLayout>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <img
              className="object-contain h-128 w-full"
              src={product.image}
              alt="Produto"
            />
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap justify-between items-center mb-2">
                <h1 className="text-4xl font-bold text-slate-800 ">{product.name}</h1>
                {user.is_superuser &&
                <>
                  <button
                    onClick={() => setModalState({ [productId]: true })}
                    className="ml-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-8 rounded">
                    Remover Produto
                  </button>
                  <Modal
                    isOpen={modalState[productId] || false}
                    onClose={() => setModalState({})}
                    onConfirm={() => handleRemoveProduct(productId)}
                    title="Confirmação de Remoção"
                    message={`Tem certeza que deseja remover o produto '${product.name}'?`}
                  />
                </>
                }
              </div>
              <hr className="border-gray-400 mb-6" />
              <div className="flex items-baseline mb-6">
                <p className="text-3xl text-green-600 font-bold mr-2">{product.salePrice} R$</p>
                <p className="text-lg text-gray-500">por embalagem</p>
              </div>
              <p className="text-xl text-gray-700 mb-6">
                {product.description}
              </p>
              <div className="flex items-center mb-6">
                <p className="text-xl text-gray-700 font-bold mr-3">Unidades por Embalagem:</p>
                <p className="text-xl text-gray-700">{product.packaging}</p>
              </div>
              <div className="flex items-center mb-6">
                <p className="text-xl text-gray-700 font-bold mr-3">Categoria:</p>
                <Link href={`/products?categorytId=${product.category}`} className="text-xl text-blue-600">{category.name}</Link>
              </div>
            </div>
            <div className="flex flex-wrap justify-between items-center mt-autos">
              <Link href={`/purchase?productId=${productId}`} className="bg-blue-600 hover:bg-blue-700 text-white text-3xl font-bold py-6 px-16 rounded focus:outline-none focus:shadow-outline">
                Comprar
              </Link>
              {user.is_superuser &&
              <>
                <Link href={`/products/update?productId=${productId}`} className="hover:bg-white border-2 border-blue-600 text-blue-600 font-bold py-7 px-8 rounded focus:outline-none focus:shadow-outline">
                  Atualizar Produto
                </Link>
                <Link href={`/products/register-promotion?productId=${productId}`} className="hover:bg-white border-2 border-blue-600 text-blue-600 font-bold py-7 px-8 rounded focus:outline-none focus:shadow-outline">
                  Cadastrar Promoção
                </Link>
              </>
              }
            </div>
          </div>
        </div>
      </BaseLayout>
    </ProtectedRoute>
  )
}