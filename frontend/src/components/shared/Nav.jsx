import Link from 'next/link'
import { useState, useContext } from "react"
import { useRouter } from "next/router"
import { AuthContext } from '@/contexts/authContext'

export default function Nav() {

  const router = useRouter()
  const { user } = useContext(AuthContext)
  const [formData, setFormData] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData)
      return

    router.push(`/products?fetchProduct=${formData}`)
  }

  return (
    <nav className="bg-gray-800 relative">
      <div className="px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-white font-bold text-lg">
            B2B Soluções
          </Link>
          <div className="w-auto md:w-1/2">
            <form className="flex" onSubmit={handleSubmit}>
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
          <div className="flex gap-0 lg:gap-7">
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
            <div className="block lg:hidden my-auto">
              <button onClick={handleToggleMenu} className="flex items-center px-3 py-2 border-4 rounded text-gray-300 bg-gray-800 border-gray-300 hover:text-white hover:border-white">
                <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={`${isMenuOpen ? 'flex' : 'hidden'} lg:block items-start bg-gray-800 w-full absolute lg:static z-20`}>
        <div className="py-4 px-0 lg:px-5 flex flex-col lg:flex-row items-center justify-start lg:justify-center w-full gap-3 lg:gap-7">
          <Link href="/products" className="text-gray-300 hover:text-white text-sm font-medium">
            Produtos
          </Link>
          <Link href="/categories" className="text-gray-300 hover:text-white text-sm font-medium">
            Categorias
          </Link>
          <Link href='/orders' className="text-gray-300 hover:text-white text-sm font-medium">
            Pedidos
          </Link>
          {(user && user.is_superuser) &&
            <>
              <Link href="/suppliers" className="text-gray-300 hover:text-white text-sm font-medium">
                Fornecedores
              </Link>
              <Link href="/carriers" className="text-gray-300 hover:text-white text-sm font-medium">
                Transportadoras
              </Link>
              <Link href="/restock" className="text-gray-300 hover:text-white text-sm font-medium">
                Ressuprimento de Produtos
              </Link>
              <Link href="/analysis" className="text-gray-300 hover:text-white text-sm font-medium">
                Análise de Créditos
              </Link>
              <Link href="/payments" className="text-gray-300 hover:text-white text-sm font-medium">
                Pagamentos
              </Link>
            </>
          }
          <Link href="/support" className="text-gray-300 hover:text-white text-sm font-medium">
            Suporte
          </Link>
          <Link href="/profile" className="text-gray-300 hover:text-white text-sm font-medium">
            Perfil
          </Link>
        </div>
      </div>
    </nav>
  )
}