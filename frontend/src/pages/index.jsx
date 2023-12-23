import Link from 'next/link'
import Nav from '@/components/shared/Nav'
import Footer from '@/components/shared/Footer'
import ProtectedRoute from '@/components/routes/ProtectedRoute'
import { useEffect, useState } from 'react'
import { getCategories, getProducts } from '@/services/productService'
import { getPromotions } from '@/services/marketingService'

export default function Home() {

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [promotions, setPromotions] = useState([])
  const [activePromotionsProducts, setActivePromotionsProducts] = useState([]);
  const [messages, setMessages] = useState({
    products: "",
    categories: ""
  })

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getProducts()
        if (products.length === 0) {
          setMessages({
            ...messages,
            products: "Ainda não existem produtos cadastrados."
          })
        }

        setProducts(products)
      } catch (e) {
        alert(e.message)
      }
    }
    
    const fetchCategories = async () => {
      try {
        const categories = await getCategories()
        if (categories.length === 0) {
          setMessages({
            ...messages,
            categories: "Ainda não existem categorias cadastradas."
          })
        }

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
  }, [])

  useEffect(() => {
    const now = new Date()
    const activePromotions = promotions.filter(promotion =>
      new Date(promotion.endDate) >= now && 
      new Date(promotion.startDate) <= now
    )

    const productsWithPromotion = products.map(product => {
      const promotion = activePromotions.find(promo => promo.product === product.id)
      return { ...product, promotion }
    })

    setActivePromotionsProducts(productsWithPromotion)
  }, [promotions, products])

  const findCategoryName = (categoryId) => {
    const category = categories.find(category => category.id === categoryId)
    return category ? category.name : ''
  }
  
  return (
    <ProtectedRoute isProtected>
      <main className="bg-blue-50 min-h-screen">
        <Nav />
        <div className="container mx-auto px-8 py-8">
          <h1 className="text-4xl font-bold text-slate-800 text-center mb-12">
            Os Melhores Produtos a Venda para Todos os Tipos de Organizações
          </h1>
          <h1 className="text-4xl font-bold text-slate-800 mb-4 text-center md:text-start">Categorias em Destaque</h1>
          {categories.length !== 0 ?
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {categories
                .slice(0, 4)
                .map((category) => (
                  <Link 
                    key={category.id} 
                    href={`/products?categoryId=${category.id}`} 
                    className="bg-white rounded-full shadow-lg px-4 py-6 block border-4 border-white hover:bg-gray-100 flex justify-center items-center"
                  >
                    <h2 className="text-xl text-center font-bold">{category.name}</h2>
                  </Link>
              ))}
            </section>
            :
            <p>{messages.categories}</p>
          }
          <h1 className="text-4xl font-bold text-slate-800 mb-4 text-center md:text-start">
            Produtos em Destaque
          </h1>
          {products.length !== 0 ?
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {activePromotionsProducts.filter(product => !product.promotion).slice(0, 3).map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-lg px-4 py-6">
                  <img
                    src={product.image}
                    alt="Produto"
                    className="object-contain h-56 w-full rounded-lg mb-4"
                  />
                  <hr className="border-2 border-slate-200 mb-2"/>
                  <h2 className="text-xl font-bold mb-2">{product.name}</h2>
                  <p className="text-gray-600 text-lg font-semibold mb-2">
                    Categoria: <Link href={`/products?categoryId=${product.category}`} className="text-blue-800 hover:underline">{findCategoryName(product.category)}</Link>
                  </p>
                  <p className="mb-4">
                    <span className="text-gray-800 font-bold text-xl">R$ {product.salePrice.toFixed(2)}</span>
                  </p>
                  <Link href={`/products/${product.id}`} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Mais Informações
                  </Link>
                </div>
              ))}
            </section>
            :
            <p>{messages.products}</p>
          }
          {activePromotionsProducts.some(product => product.promotion) &&
            <>
              <h1 className="text-4xl font-bold text-slate-800 mb-4 text-center md:text-start">
                Algumas de Nossas Promoções
              </h1>
              <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {activePromotionsProducts.filter(product => product.promotion).slice(0, 3).map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow-lg px-4 py-6">
                    <img
                      src={product.image}
                      alt="Produto"
                      className="object-contain h-56 w-full rounded-lg mb-4"
                    />
                    <hr className="border-2 border-slate-200 mb-2"/>
                    <h2 className="text-xl font-bold mb-2">{product.name}</h2>
                    <p className="text-gray-600 text-lg font-semibold mb-2">
                      Categoria: <Link href={`/products?categoryId=${product.category}`} className="text-blue-800 hover:underline">{findCategoryName(product.category)}</Link>
                    </p>
                    <p className="mb-4">
                      <span className="text-gray-800 font-bold text-xl line-through">R$ {product.salePrice.toFixed(2)}</span>
                      <span className="text-green-800 font-bold text-xl "> R$ {product.promotion.salePrice.toFixed(2)}</span>
                    </p>
                    <Link href={`/products/${product.id}`} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                      Mais Informações
                    </Link>
                  </div>
                ))}
              </section>
            </>
          }
        </div>
        <div className="bg-blue-600 h-64 flex flex-col px-4 md:px-0 justify-center items-center">
          <h1 className="text-4xl font-bold text-white text-center mb-4">
            Ficou com Alguma Dúvida?
          </h1>
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            Sem Problemas! Envie um Ticket Agora Para o Nosso Suporte.
          </h2>
          <div className="flex justify-center items-center">
            <Link href="/support" className="bg-white hover:bg-slate-100 text-xl text-blue-600 text-center font-bold py-6 px-20 rounded">
              Suporte
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    </ProtectedRoute>
  )
}