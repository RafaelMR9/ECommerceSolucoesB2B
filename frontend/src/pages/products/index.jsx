import Link from "next/link"
import BaseLayout from "@/components/shared/BaseLayout"
import { useState, useEffect } from "react"
import { getProducts } from "@/services/productService"

export default function Products() {
  
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getProducts()
        setProducts(products)
      } catch (e) {
        alert(e.message)
      }
    }
    
    fetchProducts()
  }, [])

  return (
    <BaseLayout>
      <div className="flex justify-between mb-4">
        <h1 className="text-4xl font-bold text-slate-800">Produtos</h1>
        <Link href="/products/register" className="hover:bg-white border-2 border-blue-600 text-blue-600 flex items-center font-bold py-2 px-8 rounded focus:outline-none focus:shadow-outline">
          Cadastrar Produto
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {products.map((product) => {
          return (
            <div key={product.id} className="bg-white rounded-lg shadow-lg px-4 py-6">
              <img
                src={product.image}
                alt="Produto"
                className="object-contain h-56 w-full rounded-lg mb-4"
              />
              <h2 className="text-xl font-bold mb-2">{product.name}</h2>
              <p className="text-gray-600 text-lg font-semibold mb-4">
                Categoria: <Link href={`/products?categoryId=${product.category}`} className="text-blue-800 hover:underline">{product.category}</Link>
              </p>
              <p className="text-gray-800 font-bold text-xl mb-4">
                R$ {product.salePrice}
              </p>
              <Link href={`/products/${product.id}`} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Mais Informações
              </Link>
            </div>
          )
        })}
      </div>
    </BaseLayout>
  )
}