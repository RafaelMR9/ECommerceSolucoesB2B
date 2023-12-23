import Link from "next/link"
import BaseLayout from "@/components/shared/BaseLayout"
import ProtectedRoute from "@/components/routes/ProtectedRoute"
import Modal from "@/components/shared/Modal"
import { AuthContext } from "@/contexts/authContext"
import { useState, useEffect, useContext } from "react"
import { getProduct, getCategory, removeProduct } from "@/services/productService"
import { getProductPromotion } from "@/services/marketingService"
import { useRouter } from "next/router"
import { checkNullObject } from "@/utils/utils"
import { getSupplier } from "@/services/supplierService"

export default function Product() {

  const router = useRouter()
  const { user } = useContext(AuthContext)
  const { productId } = router.query
  const [product, setProduct] = useState({})
  const [promotion, setPromotion] = useState({})
  const [category, setCategory] = useState({})
  const [supplier, setSupplier] = useState({})
  const [modalState, setModalState] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true)

        const product = await getProduct(productId)
        const category = await getCategory(product.category)
        const supplier = await getSupplier(product.supplier)
        const promotion = await getProductPromotion(productId)
        
        setProduct({
          ...product,
          salePrice: product.salePrice.toFixed(2)
        })
        setCategory(category)
        setSupplier(supplier)

        if (checkNullObject(promotion)) {
          setPromotion({
            ...promotion,
            salePrice: promotion.salePrice
          })
        }
        else {
          setPromotion({
            ...promotion,
            salePrice: promotion.salePrice.toFixed(2)
          })
        }

        setIsLoading(false)

      } catch (e) {
        setIsLoading(false)
        router.push('/products')
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
        { isLoading ?
          <div className="flex items-center justify-center mt-32">
            <div className={`animate-spin ease-linear rounded-full h-32 w-32 pt-14 border-8 border-l-gray-400 border-r-gray-400 border-b-gray-400 border-t-indigo-900`}/>
          </div>
          :
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
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-8 rounded mt-2">
                      Remover Produto
                    </button>
                    <Modal
                      isOpen={modalState[productId] || false}
                      onClose={() => setModalState({})}
                      onConfirm={() => handleRemoveProduct(productId)}
                      title="Confirmação de Remoção"
                      message={`Tem certeza que deseja remover o produto '${product.name}'?`}
                      option1="Remover"
                      option2="Cancelar"
                    />
                  </>
                  }
                </div>
                <hr className="border-gray-400 mb-6" />
                <div className="flex items-baseline mb-6">
                  {
                    checkNullObject(promotion) ?
                      <p className="text-3xl text-green-600 font-bold mr-2">R$ {product.salePrice}</p>
                      :
                      <p className="text-3xl text-red-600 font-bold mr-2">
                        <span className="line-through">R$ {product.salePrice}</span>
                        <span className="text-green-600 font-bold"> R$ {promotion.salePrice}</span>
                      </p>
                  }
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
                {user.is_superuser &&
                <div className="flex items-center mb-6">
                  <p className="text-xl text-gray-700 font-bold mr-3">Fornecedor:</p>
                  <Link href={`/suppliers/${supplier.id}`} className="text-xl text-blue-600">
                    {supplier.name}
                  </Link>
                </div> 
                }
              </div>
              <div className="flex flex-wrap justify-between items-center mt-autos">
                {!user.is_superuser && (
                  user.canPurchase
                    ? <Link href={`/purchase?productId=${productId}`} className="bg-blue-600 hover:bg-blue-700 text-white text-3xl font-bold py-6 px-16 rounded focus:outline-none focus:shadow-outline">
                        Comprar
                      </Link>
                    : <span className="text-lg font-semibold text-red-600">Você não pode realizar compras até efetuar os pagamentos que estão pendentes.</span>
                  )
                }
                {user.is_superuser &&
                <>
                  <Link href={`/products/update?productId=${productId}`} className="hover:bg-blue-600 hover:text-white border-2 border-blue-600 text-blue-600 transition duration-200 font-bold py-4 px-8 rounded focus:outline-none focus:shadow-outline">
                    Atualizar Produto
                  </Link>
                  <Link href={`/products/register-promotion?productId=${productId}`} className="hover:bg-blue-600 hover:text-white border-2 border-blue-600 text-blue-600 transition duration-200 font-bold py-4 px-8 rounded focus:outline-none focus:shadow-outline">
                    Cadastrar Promoção
                  </Link>
                </>
                }
              </div>
            </div>
          </div>
        }
      </BaseLayout>
    </ProtectedRoute>
  )
}