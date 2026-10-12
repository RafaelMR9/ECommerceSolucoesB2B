import Link from 'next/link'
import { ArrowUpRight, Headset, Package, ShoppingBag, Truck } from 'lucide-react'

export default function ProfileShortcuts({ admin }) {
  const shortcuts = [
    [
      '/orders',
      admin ? 'Gerenciar Pedidos' : 'Meus Pedidos',
      'Consulte pedidos e acompanhe as entregas.',
      Package,
    ],
    [
      admin ? '/restock' : '/products',
      admin ? 'Ressuprimento' : 'Explorar Catálogo',
      admin
        ? 'Organize as compras dos seus fornecedores.'
        : 'Encontre os essenciais para sua empresa.',
      admin ? Truck : ShoppingBag,
    ],
    ['/support', 'Central de Suporte', 'Veja suas conversas e envie uma nova mensagem.', Headset],
  ]
  return (
    <aside className="panel profile-shortcuts" aria-labelledby="profile-shortcuts-title">
      <h2 id="profile-shortcuts-title">Sua Rotina em um Só Lugar</h2>
      <p>Acesse o que você precisa para continuar.</p>
      <nav aria-label="Atalhos da Conta">
        {shortcuts.map(([href, title, description, Icon]) => (
          <Link href={href} key={href}>
            <span className="profile-shortcut-icon">
              <Icon size={21} aria-hidden="true" />
            </span>
            <span>
              <strong>{title}</strong>
              <small>{description}</small>
            </span>
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        ))}
      </nav>
    </aside>
  )
}
