import Container from '@/components/shared/Container'
import Link from 'next/link'
import { ArrowUpRight, Headset } from 'lucide-react'
import Brand from './Brand'
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
        <div className="grid grid-cols-[1fr_1fr_1.5fr] gap-12 py-[30px] px-0 items-start max-[850px]:gap-[30px] max-[600px]:grid-cols-[1fr_1fr] max-[600px]:gap-[27px] max-[600px]:pt-[30px] max-[400px]:grid-cols-1">
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
          <div className="min-w-0 p-[22px] border border-[#56406b] rounded-[14px] bg-[#21172d] max-[600px]:col-span-full">
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
        <Container className="flex flex-col items-center text-center gap-1.5 pt-[19px] pb-[23px] text-caption text-[#c9bad5] border-t border-t-[#493459]">
          <p className="max-w-full">
            © 2026 B2B Soluções. Demonstração de Portfólio.{' '}
            <span className="inline-block whitespace-nowrap">Todos os direitos reservados.</span>
          </p>
          <span>
            Desenvolvido por{' '}
            <a
              className="inline-flex items-center gap-[3px] text-[#d6b5ff] underline underline-offset-4 min-h-8 hover:text-white"
              href="https://rafael-dev.vercel.app/"
            >
              Rafael Ribeiro <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          </span>
        </Container>
      </div>
    </footer>
  )
}
