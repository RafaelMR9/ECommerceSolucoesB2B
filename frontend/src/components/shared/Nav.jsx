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
  ['/analysis', 'Análise de Crédito'],
  ['/payments', 'Pagamentos'],
]
export default function Nav() {
  const router = useRouter()
  const { user, cartCount } = useContext(AuthContext)
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
        Pular para o Conteúdo
      </a>
      <div className="site-top">
        <div className="site-top-inner site-width">
          <span>
            <Building2 size={12} aria-hidden="true" />
            Soluções para a Rotina da Sua Empresa
          </span>
          <span>Compras, Pedidos e Suporte em um Só Lugar</span>
          <span>Projeto de Portfólio</span>
        </div>
      </div>
      <header className="site-header">
        <div className="site-header-main site-width">
          <Brand />
          <form className="header-search" onSubmit={search} role="search">
            <Search size={20} aria-hidden="true" />
            <input
              aria-label="Buscar Produtos"
              type="search"
              placeholder="O Que Sua Empresa Precisa Hoje?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" aria-label="Pesquisar Produtos">
              <Search size={22} aria-hidden="true" />
            </button>
          </form>
          <div className="header-actions">
            <Link
              className="header-account"
              href={user ? '/profile' : '/authentication'}
              aria-label="Minha Conta"
            >
              <UserRound size={22} aria-hidden="true" />
              <span className="header-account-copy">
                <small>{user?.name || user?.username || 'Bem-vindo'}</small>Minha Conta
              </span>
            </Link>
            <Link
              className="header-cart"
              href="/cart"
              aria-label={
                cartCount > 0
                  ? `Carrinho: ${cartCount} ${cartCount === 1 ? 'item' : 'itens'}`
                  : 'Carrinho'
              }
            >
              <ShoppingCart size={23} aria-hidden="true" />
              {cartCount > 0 && (
                <span className="cart-count" aria-hidden="true">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              className="mobile-menu-button"
              aria-expanded={menuOpen}
              aria-controls="site-navigation"
              aria-label={menuOpen ? 'Fechar Menu' : 'Abrir Menu'}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {user?.is_superuser && (
          <nav className="admin-nav" aria-label="Administração">
            <div className="admin-nav-inner site-width">
              <span className="admin-nav-label">Área Administrativa</span>
              {adminLinks.map(([href, label]) => navLink(href, label))}
            </div>
          </nav>
        )}
        <nav
          id="site-navigation"
          className={`site-nav ${menuOpen ? 'is-open' : ''}`}
          aria-label="Navegação Principal"
        >
          <div className="site-nav-inner site-width">
            {navLink('/', 'Início')}
            {navLink('/products', 'Catálogo', <LayoutGrid size={15} aria-hidden="true" />)}
            {navLink('/categories', 'Categorias')}
            {navLink('/orders', 'Pedidos')}
            {navLink('/support', 'Suporte')}
          </div>
        </nav>
      </header>
    </>
  )
}
