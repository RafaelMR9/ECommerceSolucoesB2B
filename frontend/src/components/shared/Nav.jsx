import Link from 'next/link'
import { useContext, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import {
  BadgeCheck,
  ChevronRight,
  ClipboardList,
  CreditCard,
  House,
  LayoutGrid,
  Menu,
  MessagesSquare,
  PackagePlus,
  Search,
  ShieldCheck,
  ShoppingCart,
  Store,
  Tags,
  Truck,
  UserRound,
  X,
} from 'lucide-react'
import { AuthContext } from '@/contexts/authContext'
import Brand from './Brand'

const adminLinks = [
  ['/suppliers', 'Fornecedores', Store],
  ['/carriers', 'Transportadoras', Truck],
  ['/restock', 'Ressuprimento', PackagePlus],
  ['/analysis', 'Análise de Crédito', BadgeCheck],
  ['/payments', 'Pagamentos', CreditCard],
]
const storeLinks = [
  ['/', 'Início', House],
  ['/products', 'Catálogo', LayoutGrid],
  ['/categories', 'Categorias', Tags],
  ['/orders', 'Pedidos', ClipboardList],
  ['/support', 'Suporte', MessagesSquare],
]
export default function Nav() {
  const router = useRouter()
  const { user, cartCount } = useContext(AuthContext)
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef(null)
  const accountName = user?.name || user?.username || 'Bem-vindo'
  function search(event) {
    event.preventDefault()
    router.push({
      pathname: '/products',
      query: query.trim() ? { fetchProduct: query.trim() } : {},
    })
    setMenuOpen(false)
  }
  function navLink(href, text, Icon) {
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
        <Icon size={17} className="nav-link-icon" aria-hidden="true" />
        <span>{text}</span>
        <ChevronRight size={15} className="nav-link-arrow" aria-hidden="true" />
      </Link>
    )
  }
  return (
    <>
      <a href="#main-content" className="skip-link">
        Pular para o Conteúdo
      </a>
      <header
        className="site-header"
        onKeyDown={(event) => {
          if (event.key === 'Escape' && menuOpen) {
            setMenuOpen(false)
            menuButton.current?.focus()
          }
        }}
      >
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
              title={accountName}
            >
              <UserRound size={22} aria-hidden="true" />
              <span className="header-account-copy">
                <small>{accountName}</small>Minha Conta
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
              ref={menuButton}
              className="mobile-menu-button"
              aria-expanded={menuOpen}
              aria-controls="site-navigation"
              aria-label={menuOpen ? 'Fechar Menu' : 'Abrir Menu'}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <X size={20} aria-hidden="true" />
              ) : (
                <Menu size={20} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
        <div id="site-navigation" className={`site-navigation ${menuOpen ? 'is-open' : ''}`}>
          {user?.is_superuser && (
            <nav className="admin-nav" aria-label="Administração">
              <div className="admin-nav-inner site-width">
                <span className="admin-nav-label">
                  <ShieldCheck size={16} aria-hidden="true" />
                  Área Administrativa
                </span>
                <div className="admin-nav-links">
                  {adminLinks.map(([href, label, Icon]) => navLink(href, label, Icon))}
                </div>
              </div>
            </nav>
          )}
          <nav className="site-nav" aria-label="Navegação Principal">
            <div className="site-nav-inner site-width">
              {storeLinks.map(([href, label, Icon]) => navLink(href, label, Icon))}
            </div>
          </nav>
        </div>
      </header>
    </>
  )
}
