import Link from 'next/link'
import { useState, useContext } from "react"
import { useRouter } from "next/router"
import { AuthContext } from '@/contexts/authContext'

export default function Nav() {

  const router = useRouter()
  const { user } = useContext(AuthContext)
  const [formData, setFormData] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData)
      return

    router.push(`/products?fetchProduct=${formData}`)
  }

  return (
    <nav className="bg-gray-800">
      <div className="px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-white font-bold text-lg">
            Web Vendas
          </Link>
          <div className="flex-shrink-0 flex-grow">
            <form className="flex px-20" onSubmit={handleSubmit}>
              <input
                className="bg-gray-700 text-white rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                type="text"
                placeholder="Buscar Produtos"
                value={formData}
                onChange={(e) => setFormData(e.target.value)}
              />
              <button className="ml-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                Pesquisar
              </button>
            </form>
          </div>
          <Link href="/cart" className="p-2 text-gray-300 hover:text-white">
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M2 2l2.7 9h14.4l2.5-7H2zm8.5 18a2.5 2.5 0 110-5 2.5 2.5 0 010 5zm5 0a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"
              />
            </svg>
          </Link>
        </div>
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-12 pb-3">
          <Link href="/products" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
            Produtos
          </Link>
          <Link href="/categories" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
            Categorias
          </Link>
          <Link href='/orders' className="text-gray-300 hover:text-white px-6 rounded-md text-sm font-medium">
            Pedidos
          </Link>
          { user.is_superuser &&
          <>
            <Link href="/suppliers" className="text-gray-300 hover:text-white px-3 rounded-md text-sm font-medium">
              Fornecedores
            </Link>
            <Link href="/" className="text-gray-300 hover:text-white px-3 rounded-md text-sm font-medium">
              Ressuprimento de Produtos
            </Link>
            <Link href="/analysis" className="text-gray-300 hover:text-white px-3 rounded-md text-sm font-medium">
              Análise de Créditos
            </Link>
            <Link href="/payments" className="text-gray-300 hover:text-white px-3 rounded-md text-sm font-medium">
              Pagamentos
            </Link>
          </>
          }
          <Link href="/support" className="text-gray-300 hover:text-white px-3 rounded-md text-sm font-medium">
            Suporte
          </Link>
          <Link href="/profile" className="text-gray-300 hover:text-white px-3 rounded-md text-sm font-medium">
            Perfil
          </Link>
        </div>
      </div>
    </nav>
  )
}