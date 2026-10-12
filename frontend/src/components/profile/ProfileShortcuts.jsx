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
    <aside
      className="bg-brand-surface border border-brand-border rounded-panel p-[25px] shadow-panel min-w-0 border-t-3 border-t-[#ad86ce] max-[640px]:p-5"
      aria-labelledby="profile-shortcuts-title"
    >
      <h2 className="text-[19px] font-extrabold tracking-[-0.4px]" id="profile-shortcuts-title">
        Sua Rotina em um Só Lugar
      </h2>
      <p className="text-brand-muted text-small mt-[5px]">
        Acesse o que você precisa para continuar.
      </p>
      <nav className="mt-5" aria-label="Atalhos da Conta">
        {shortcuts.map(([href, title, description, Icon]) => (
          <Link
            className="flex items-start gap-3 min-h-11 py-[17px] px-0 border-t border-t-brand-border group/a"
            href={href}
            key={href}
          >
            <span className="text-brand-accent bg-brand-accent-soft rounded-[10px] p-2.5 shrink-0">
              <Icon size={21} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <strong className="text-ui block group-hover/a:text-brand-accent group-hover/a:underline group-hover/a:underline-offset-4">
                {title}
              </strong>
              <small className="text-brand-muted text-small leading-[1.6] block mt-[5px]">
                {description}
              </small>
            </span>
            <ArrowUpRight
              className="shrink-0 text-brand-accent mt-1.5"
              size={17}
              aria-hidden="true"
            />
          </Link>
        ))}
      </nav>
    </aside>
  )
}
