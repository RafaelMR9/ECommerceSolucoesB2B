import Container from '@/components/shared/Container'
import Image from 'next/image'
import { ArrowRight, Sparkles } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function Hero() {
  return (
    <section className="relative bg-brand-nav text-white overflow-hidden after:absolute after:inset-0 after:content-[''] after:bg-hero max-[520px]:after:bg-hero-mobile">
      <Image
        className="absolute inset-0 w-full h-full object-cover max-[520px]:object-[66%_center] max-[520px]:opacity-[0.65]"
        src="/images/brand/hero-workspace.webp"
        alt="Escritório com notebook, teclado e iluminação violeta"
        fill
        preload
        sizes="100vw"
      />
      <Container className="relative z-1 pt-12 pb-12.25 min-h-97.5 max-[520px]:min-h-116.25 max-[520px]:pt-8.75 max-[520px]:pb-10">
        <div className="max-w-118.75 max-[520px]:max-w-75">
          <p className="text-caption font-extrabold tracking-[1.2px] mb-2.5 text-[#bd9af4] flex gap-1.75 items-center">
            <Sparkles size={14} aria-hidden="true" />
            Seu Negócio em Movimento
          </p>
          <h1 className="text-[clamp(34px,4vw,46px)] leading-[1.12] tracking-[-1.9px] font-extrabold my-4.25 mx-0 max-[520px]:text-[36px]">
            Equipe Sua Rotina.
            <br />
            <span className="text-brand-focus-light">Simplifique Suas Compras.</span>
          </h1>
          <p className="max-w-[320px] text-[#c6b7d6] text-ui leading-[1.85] mb-6 max-[520px]:max-w-58.75">
            Encontre os essenciais para sua empresa e acompanhe cada pedido do começo ao fim.
          </p>
          <div className="grid grid-cols-2 gap-2.5 max-w-105 max-[520px]:grid-cols-1 max-[520px]:max-w-55">
            <Button href="/products">
              Explorar Catálogo
              <ArrowRight className="shrink-0" size={16} aria-hidden="true" />
            </Button>
            <Button href="/orders" variant="inverse">
              Meus Pedidos
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
