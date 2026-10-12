import Link from 'next/link'
import { ArrowUpRight, Headset } from 'lucide-react'
import Brand from './Brand'
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-width">
        <div className="footer-masthead">
          <Brand />
          <p>
            Equipe Sua Rotina.
            <br />
            <strong>Simplifique Suas Compras.</strong>
          </p>
        </div>
        <div className="footer-grid">
          <nav aria-label="Loja no Rodapé">
            <h2>Explore a Loja</h2>
            <ul>
              <li>
                <Link href="/">Início</Link>
              </li>
              <li>
                <Link href="/products">Catálogo de Produtos</Link>
              </li>
              <li>
                <Link href="/categories">Categorias</Link>
              </li>
            </ul>
          </nav>
          <nav aria-label="Conta no Rodapé">
            <h2>Sua Conta</h2>
            <ul>
              <li>
                <Link href="/profile">Minha Conta</Link>
              </li>
              <li>
                <Link href="/orders">Meus Pedidos</Link>
              </li>
              <li>
                <Link href="/cart">Carrinho</Link>
              </li>
            </ul>
          </nav>
          <div className="footer-support">
            <h2>
              <Headset size={18} aria-hidden="true" /> Atendimento
            </h2>
            <p>
              Precisa de ajuda com uma compra? Envie sua dúvida e acompanhe a conversa na área de
              suporte.
            </p>
            <Link className="footer-feature-link" href="/support">
              Acessar Suporte <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-bottom-inner site-width">
          <p className="footer-copyright">
            © 2026 B2B Soluções. Demonstração de Portfólio.{' '}
            <span>Todos os direitos reservados.</span>
          </p>
          <span>
            Desenvolvido por{' '}
            <a href="https://rafael-dev.vercel.app/">
              Rafael Ribeiro <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
