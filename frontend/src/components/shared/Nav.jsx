import Link from 'next/link'
import { useContext, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import {
  BadgeCheck,
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
import Container from './Container'
import NavLink from './NavLink'
import { cn } from '@/lib/classes'

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
  function navLink(href, text, Icon, administrative = false) {
    return (
      <NavLink
        key={href}
        href={href}
        onNavigate={() => setMenuOpen(false)}
        icon={Icon}
        administrative={administrative}
        active={router.pathname === href || (href !== '/' && router.pathname.startsWith(href))}
      >
        {text}
      </NavLink>
    )
  }
  return (
    <>
      <a
        href="#main-content"
        className="absolute -top-15 left-4 z-200 bg-white text-brand-accent py-3 px-4.25 rounded-lg focus:top-3"
      >
        Pular para o Conteúdo
      </a>
      <header
        className="bg-brand-nav text-white"
        onKeyDown={(event) => {
          if (event.key === 'Escape' && menuOpen) {
            setMenuOpen(false)
            menuButton.current?.focus()
          }
        }}
      >
        <Container className="flex items-center gap-7 py-6 max-[850px]:flex-wrap max-[850px]:gap-4.5 max-[600px]:gap-3 max-[600px]:py-4.5 max-[360px]:gap-1">
          <Brand className="shrink-0" small />
          <form
            className="flex items-center flex-1 min-w-0 pl-3.25 rounded-[9px] bg-white text-[#7b6c87] overflow-hidden max-[850px]:order-3 max-[850px]:basis-full focus-within:outline-solid focus-within:outline-3 focus-within:outline-brand-focus-light focus-within:outline-offset-3"
            onSubmit={search}
            role="search"
          >
            <Search className="shrink-0" size={20} aria-hidden="true" />
            <input
              className="flex-1 py-3 px-2.25 border-0 text-[#2e2239] bg-white text-body min-w-0 w-auto outline-offset-[-3px] max-[600px]:text-[16px] placeholder:text-brand-muted placeholder:opacity-[1]"
              aria-label="Buscar Produtos"
              type="search"
              placeholder="O Que Sua Empresa Precisa Hoje?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              className="flex-[0_0_52px] grid place-items-center min-h-12 bg-brand-accent p-0 text-white border-0 hover:bg-brand-accent-hover focus-visible:outline-brand-focus-light"
              type="submit"
              aria-label="Pesquisar Produtos"
            >
              <Search size={22} aria-hidden="true" />
            </button>
          </form>
          <div className="flex shrink-0 items-center gap-5.75 max-[850px]:ml-auto max-[600px]:gap-2 max-[360px]:gap-1">
            <Link
              className="min-h-11 min-w-11 justify-center flex gap-2.25 items-center text-small hover:text-[#d8beff] focus-visible:outline-brand-focus-light"
              href={user ? '/profile' : '/authentication'}
              aria-label="Minha Conta"
              title={accountName}
            >
              <UserRound className="shrink-0" size={22} aria-hidden="true" />
              <span className="block min-w-0 max-w-40 whitespace-nowrap max-[700px]:hidden">
                <small className="block text-[#b3a4c6] text-caption overflow-hidden text-ellipsis whitespace-nowrap">
                  {accountName}
                </small>
                Minha Conta
              </span>
            </Link>
            <Link
              className="relative min-h-11 min-w-11 justify-center p-1.75 flex items-center gap-1.5 hover:text-[#d8beff] focus-visible:outline-brand-focus-light"
              href="/cart"
              aria-label={
                cartCount > 0
                  ? `Carrinho: ${cartCount} ${cartCount === 1 ? 'item' : 'itens'}`
                  : 'Carrinho'
              }
            >
              <ShoppingCart size={23} aria-hidden="true" />
              {cartCount > 0 && (
                <span
                  className="absolute top-0 right-0 grid place-items-center min-w-5.25 h-5.25 py-0 px-1 border-2 border-brand-nav rounded-full bg-brand-accent text-white text-[11px] font-extrabold leading-none tabular-nums"
                  aria-hidden="true"
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              ref={menuButton}
              className="h-11 w-11 flex-[0_0_44px] hidden place-items-center bg-transparent text-white border border-[#564365] p-0 rounded-lg max-[1100px]:grid focus-visible:outline-brand-focus-light"
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
        </Container>
        <div
          id="site-navigation"
          className={cn(
            'max-[1100px]:mx-auto max-[1100px]:max-w-310 max-[1100px]:px-8 max-[1100px]:pb-5 max-[600px]:px-5 max-[600px]:pb-4.5 max-[360px]:px-4',
            menuOpen ? 'max-[1100px]:block' : 'max-[1100px]:hidden'
          )}
        >
          {user?.is_superuser && (
            <nav
              className="bg-brand-nav border-t border-t-[#34283f] max-[1100px]:p-4 max-[1100px]:border max-[1100px]:border-[#382a46] max-[1100px]:rounded-xl max-[1100px]:bg-[#1c1526] max-[1100px]:mb-3"
              aria-label="Administração"
            >
              <div className="mx-auto flex max-w-310 items-center gap-2 px-8 py-1.25 max-[1100px]:block max-[1100px]:p-0">
                <span className="flex items-center gap-1.75 text-small text-[#c5a2ed] shrink-0 whitespace-nowrap max-[1100px]:mb-3 max-[1100px]:text-caption max-[1100px]:font-bold">
                  <ShieldCheck size={16} aria-hidden="true" />
                  Área Administrativa
                </span>
                <div className="flex items-center gap-2 min-w-0 max-[1100px]:grid max-[1100px]:grid-cols-3 max-[1100px]:gap-2 max-[700px]:grid-cols-2 max-[520px]:grid-cols-1">
                  {adminLinks.map(([href, label, Icon]) => navLink(href, label, Icon, true))}
                </div>
              </div>
            </nav>
          )}
          <nav
            className="border-t border-t-[#34283f] max-[1100px]:border-0"
            aria-label="Navegação Principal"
          >
            <div className="mx-auto flex max-w-310 items-center gap-2 px-8 py-1.75 max-[1100px]:grid max-[1100px]:grid-cols-5 max-[1100px]:p-0 max-[700px]:grid-cols-2">
              {storeLinks.map(([href, label, Icon]) => navLink(href, label, Icon))}
            </div>
          </nav>
        </div>
      </header>
    </>
  )
}
