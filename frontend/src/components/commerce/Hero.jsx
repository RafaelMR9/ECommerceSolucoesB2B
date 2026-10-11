import Image from 'next/image'
import { ArrowRight, Sparkles } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function Hero() {
  return (
    <section className="home-hero">
      <Image
        className="home-hero-art"
        src="/images/brand/hero-workspace.webp"
        alt="Escritório com notebook, teclado e iluminação violeta"
        fill
        priority
        sizes="100vw"
      />
      <div className="home-hero-inner site-width">
        <div className="home-hero-copy">
          <p className="eyebrow">
            <Sparkles size={14} aria-hidden="true" />
            Seu negócio em movimento
          </p>
          <h1>
            Equipe sua rotina.
            <br />
            <span>Simplifique suas compras.</span>
          </h1>
          <p>Encontre os essenciais para sua empresa e acompanhe cada pedido do começo ao fim.</p>
          <div className="hero-buttons">
            <Button href="/products">
              Explorar catálogo
              <ArrowRight size={16} aria-hidden="true" />
            </Button>
            <Button href="/orders" variant="secondary">
              Meus pedidos
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
