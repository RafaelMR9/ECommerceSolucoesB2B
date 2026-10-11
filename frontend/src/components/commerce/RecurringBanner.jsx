import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import Button from '@/components/ui/Button'
export default function RecurringBanner() {
  return (
    <section className="recurring-banner">
      <div className="recurring-banner-copy">
        <p className="eyebrow">Planeje o Próximo Pedido</p>
        <h2>
          Sua Rotina Se Repete.
          <br />
          Suas Compras Podem Acompanhar.
        </h2>
        <p>Organize pedidos recorrentes e mantenha os essenciais da sua empresa no planejamento.</p>
        <Button href="/orders">
          Acessar Meus Pedidos
          <ArrowRight size={16} aria-hidden="true" />
        </Button>
      </div>
      <div className="recurring-banner-image">
        <Image
          src="/images/brand/recurring-supplies.webp"
          alt="Cadernos, papel e embalagens em uma mesa de escritório"
          fill
          sizes="(max-width: 520px) 100vw, 50vw"
        />
      </div>
    </section>
  )
}
