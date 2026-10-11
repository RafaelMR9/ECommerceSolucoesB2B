import Link from 'next/link'
import { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { Building2, LayoutGrid, Menu, Search, ShoppingCart, UserRound, X } from 'lucide-react'
import { AuthContext } from '@/contexts/authContext'
import Brand from './Brand'

const adminLinks = [
  ['/suppliers', 'Fornecedores'],
  ['/carriers', 'Transportadoras'],
  ['/restock', 'Ressuprimento'],
  ['/analysis', 'Análise de crédito'],
  ['/payments', 'Pagamentos'],
]
export default function Nav() {
  const router = useRouter()
  const { user } = useContext(AuthContext)
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  function search(event) {
    event.preventDefault()
    router.push({
      pathname: '/products',
      query: query.trim() ? { fetchProduct: query.trim() } : {},
    })
    setMenuOpen(false)
  }
  function navLink(href, text, icon) {
    return (
      <Link
        key={href}
        href={href}
        onClick={() => setMenuOpen(false)}
        aria-current={
          router.pathname === href || (href !== '/' && router.pathname.startsWith(href))
            ? 'page'
            : undefined
        }
      >
        {icon}
        {text}
      </Link>
    )
  }
  return (
    <>
      <a href="#main-content" className="skip-link">
        Pular para o conteúdo
      </a>
      <div className="site-top">
        <div className="site-top-inner site-width">
          <span>
            <Building2 size={12} aria-hidden="true" />
            Soluções para a rotina da sua empresa
          </span>
          <span>Compras, pedidos e suporte em um só lugar</span>
          <span>Projeto de portfólio</span>
        </div>
      </div>
      <header className="site-header">
        <div className="site-header-main site-width">
          <Brand />
          <form className="header-search" onSubmit={search} role="search">
            <Search size={17} aria-hidden="true" />
            <input
              aria-label="Buscar produtos"
              type="search"
              placeholder="O que sua empresa precisa hoje?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" aria-label="Pesquisar produtos">
              <Search size={18} aria-hidden="true" />
            </button>
          </form>
          <div className="header-actions">
            <Link
              className="header-account"
              href={user ? '/profile' : '/authentication'}
              aria-label="Minha conta"
            >
              <UserRound size={22} aria-hidden="true" />
              <span className="header-account-copy">
                <small>{user?.name || user?.username || 'Bem-vindo'}</small>Minha conta
              </span>
            </Link>
            <Link className="header-cart" href="/cart" aria-label="Carrinho">
              <ShoppingCart size={23} aria-hidden="true" />
            </Link>
            <button
              type="button"
              className="mobile-menu-button"
              aria-expanded={menuOpen}
              aria-controls="site-navigation"
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        <nav
          id="site-navigation"
          className={`site-nav ${menuOpen ? 'is-open' : ''}`}
          aria-label="Navegação principal"
        >
          <div className="site-nav-inner site-width">
            {navLink('/products', 'Catálogo', <LayoutGrid size={15} aria-hidden="true" />)}
            {navLink('/', 'Início')}
            {navLink('/categories', 'Categorias')}
            {navLink('/orders', 'Pedidos')}
            {navLink('/support', 'Suporte')}
            {user?.is_superuser && (
              <span className="nav-admin text-xs text-purple-300">Área administrativa</span>
            )}
          </div>
        </nav>
      </header>
      {user?.is_superuser && (
        <nav className="admin-nav" aria-label="Administração">
          <div className="admin-nav-inner site-width">
            <span className="admin-nav-label">Gestão</span>
            {adminLinks.map(([href, label]) => navLink(href, label))}
          </div>
        </nav>
      )}
    </>
  )
}
