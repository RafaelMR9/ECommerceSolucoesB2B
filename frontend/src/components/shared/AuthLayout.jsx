import Image from 'next/image'
import Brand from './Brand'

export default function AuthLayout({ title, description, children }) {
  return (
    <main className="auth-layout">
      <aside className="auth-story">
        <Image
          className="auth-story-image"
          src="/images/brand/hero-workspace.webp"
          alt=""
          fill
          sizes="50vw"
          priority
        />
        <Brand />
        <div className="auth-story-copy">
          <p className="eyebrow">Seu Negócio em Movimento</p>
          <h2>
            Equipe Sua Rotina.
            <br />
            Simplifique Suas Compras.
          </h2>
          <p>Produtos, pedidos recorrentes e atendimento para a rotina da sua organização.</p>
        </div>
        <p className="auth-story-foot">B2B Soluções · Projeto de portfólio</p>
      </aside>
      <section className="auth-content">
        <div className="auth-form">
          <p className="eyebrow">B2B Soluções</p>
          <h1>{title}</h1>
          <p className="auth-intro">{description}</p>
          {children}
        </div>
      </section>
    </main>
  )
}
