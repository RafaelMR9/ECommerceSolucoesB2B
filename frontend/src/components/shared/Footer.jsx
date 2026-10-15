import Container from '@/components/shared/Container'
import Link from 'next/link'
import { ArrowUpRight, Headset } from 'lucide-react'
import Brand from './Brand'
import DeveloperCredit from './DeveloperCredit'
const linkGroups = [
  {
    title: 'Explore a Loja',
    label: 'Loja no Rodapé',
    links: [
      ['/', 'Início'],
      ['/products', 'Catálogo de Produtos'],
      ['/categories', 'Categorias'],
    ],
  },
  {
    title: 'Sua Conta',
    label: 'Conta no Rodapé',
    links: [
      ['/profile', 'Minha Conta'],
      ['/orders', 'Meus Pedidos'],
      ['/cart', 'Carrinho'],
    ],
  },
]
export default function Footer() {
  return (
    <footer className="mt-auto bg-brand-nav text-[#d4c8df] border-t-3 border-t-brand-accent">
      <Container>
        <div className="flex items-center justify-between gap-6 py-8 px-0 border-b border-b-[#34283f] max-[600px]:items-start max-[600px]:flex-col max-[600px]:gap-3.5">
          <Brand className="text-[25px] max-[600px]:text-[25px]" />
          <p className="text-ui leading-[1.7] text-right text-[#c7b4d9] max-[600px]:text-left">
            Equipe Sua Rotina.
            <br />
            <strong className="text-[#eee1ff] font-bold">Simplifique Suas Compras.</strong>
          </p>
        </div>
        <div className="grid grid-cols-[1fr_1fr_1.5fr] gap-12 py-7.5 px-0 items-start max-[850px]:gap-7.5 max-[600px]:grid-cols-[1fr_1fr] max-[600px]:gap-6.75 max-[600px]:pt-7.5 max-[400px]:grid-cols-1">
          {linkGroups.map(({ title, label, links }) => (
            <nav className="min-w-0" aria-label={label} key={label}>
              <h2 className="mb-3 text-ui font-bold text-[#d5b1ff]">{title}</h2>
              <ul>
                {links.map(([href, text]) => (
                  <li key={href}>
                    <Link
                      className="inline-flex min-h-11 items-center text-small hover:text-white hover:underline hover:underline-offset-4 focus-visible:outline-brand-focus-light"
                      href={href}
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div className="min-w-0 p-5.5 border border-[#56406b] rounded-panel bg-[#21172d] max-[600px]:col-span-full">
            <h2 className="flex items-center gap-2 text-ui text-[#d5b1ff] font-bold mb-3">
              <Headset size={18} aria-hidden="true" /> Atendimento
            </h2>
            <p className="text-small leading-[1.8] mt-3">
              Precisa de ajuda com uma compra? Envie sua dúvida e acompanhe a conversa na área de
              suporte.
            </p>
            <Link
              className="inline-flex items-center gap-2 min-h-11 text-small mt-3.5 text-[#e8d6ff] font-bold hover:text-white hover:underline hover:underline-offset-4 focus-visible:outline-brand-focus-light"
              href="/support"
            >
              Acessar Suporte <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Container>
      <div>
        <Container className="flex flex-col items-center text-center gap-1.5 pt-4.75 pb-6 text-caption text-[#c9bad5] border-t border-t-[#493459]">
          <p className="max-w-full">
            © 2026 B2B Soluções. Demonstração de Portfólio.{' '}
            <span className="inline-block whitespace-nowrap">Todos os direitos reservados.</span>
          </p>
          <DeveloperCredit inverse />
        </Container>
      </div>
    </footer>
  )
}
