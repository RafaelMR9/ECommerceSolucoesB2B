import Link from "next/link"
import BaseLayout from "@/components/shared/BaseLayout"
import ProtectedRoute from "@/components/routes/ProtectedRoute"
import { useState, useEffect, useContext } from "react"
import { AuthContext } from "@/contexts/authContext"
import { getProduct } from "@/services/productService"

export default function Product() {
  const { user } = useContext(AuthContext)

  const [product, setProduct] = useState({})
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        //const product = await getProduct()
        //setProduct(categories)
      } catch (e) {
        setErrorMessage(e.message)
      }
    }

    //fetchCategories()
  })

  return (
    <ProtectedRoute isProtected>
      <BaseLayout>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <img
              className="object-contain h-60 lg:h-full w-full"
              src="https://dummyimage.com/600x400/000/fff"
              alt="Produto"
            />
          </div>
          <div className="flex flex-col justify-between h-full">
            <div>
              <div className="flex flex-wrap justify-between items-center mb-2">
                <h1 className="text-4xl font-bold text-slate-800 ">Nome do Produto</h1>
                <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-8 rounded focus:outline-none focus:shadow-outline">
                  Remover Produto
                </button>
              </div>
              <hr className="border-gray-400 mb-4" />
              <div className="flex items-baseline mb-4">
                <p className="text-3xl text-green-600 font-bold mr-2">R$10.00</p>
                <p className="text-lg text-gray-500">por embalagem</p>
              </div>
              <p className="text-lg text-gray-700 mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc lobortis sapien
                eget quam ultrices lobortis. Sed ac tellus quis tellus sodales tincidunt.
              </p>
              <div className="flex items-center mb-4">
                <p className="text-lg text-gray-700 font-bold mr-4">Unidades por Embalagem:</p>
                <p className="text-lg text-gray-700">1</p>
              </div>
              <div className="flex items-center mb-4">
                <p className="text-lg text-gray-700 font-bold mr-4">Categoria:</p>
                <Link href="#" className="text-lg text-blue-600">Categoria do Produto</Link>
              </div>
            </div>
            <div className="flex flex-wrap justify-between items-center mt-autos">
              <Link href="#" className="bg-blue-600 hover:bg-blue-700 text-white text-3xl font-bold py-6 px-16 rounded focus:outline-none focus:shadow-outline">
                Comprar
              </Link>
              <Link href="/products/update" className="hover:bg-white border-2 border-blue-600 text-blue-600 font-bold py-7 px-8 rounded focus:outline-none focus:shadow-outline">
                Atualizar Produto
              </Link>
              <Link href="/products/register-promotion" className="hover:bg-white border-2 border-blue-600 text-blue-600 font-bold py-7 px-8 rounded focus:outline-none focus:shadow-outline">
                Cadastrar Promoção
              </Link>
            </div>
          </div>
        </div>
      </BaseLayout>
    </ProtectedRoute>
  )
}