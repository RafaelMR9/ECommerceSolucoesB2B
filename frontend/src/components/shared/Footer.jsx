import Link from 'next/link'
import Brand from './Brand'
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid site-width">
        <div>
          <Brand compact />
          <p>Uma plataforma para organizar as compras e a rotina da sua empresa.</p>
        </div>
        <div>
          <h2>Sua organização</h2>
          <Link href="/products">Catálogo de produtos</Link>
          <Link href="/orders">Meus pedidos</Link>
          <Link href="/cart">Carrinho</Link>
        </div>
        <div>
          <h2>Atendimento</h2>
          <Link href="/support">Suporte por tickets</Link>
          <Link href="/profile">Minha conta</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-bottom-inner site-width">
          <span>B2B Soluções · Demonstração de portfólio</span>
          <span>Desenvolvido por Rafael</span>
        </div>
      </div>
    </footer>
  )
}
