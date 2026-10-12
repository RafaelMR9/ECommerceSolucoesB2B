import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import Button from '@/components/ui/Button'
export default function RecurringBanner() {
  return (
    <section className="grid grid-cols-[1.1fr_1fr] rounded-[18px] overflow-hidden bg-brand-accent-soft mt-[38px] max-[520px]:grid-cols-1">
      <div className="p-[30px] max-[520px]:p-6">
        <p className="text-brand-accent text-caption font-extrabold tracking-[1.2px] mb-2.5">
          Planeje o Próximo Pedido
        </p>
        <h2 className="text-[29px] leading-[1.25] tracking-[-1px] font-extrabold mt-2.5 mr-0 mb-3.5 ml-0 max-[520px]:text-[26px]">
          Sua Rotina Se Repete.
          <br />
          Suas Compras Podem Acompanhar.
        </h2>
        <p className="text-ui text-[#79618e] leading-[1.8] max-w-[340px] mb-[21px]">
          Organize pedidos recorrentes e mantenha os essenciais da sua empresa no planejamento.
        </p>
        <Button href="/orders">
          Acessar Meus Pedidos
          <ArrowRight className="shrink-0" size={16} aria-hidden="true" />
        </Button>
      </div>
      <div className="relative min-h-[300px] max-[520px]:min-h-[190px]">
        <Image
          className="object-cover"
          src="/images/brand/recurring-supplies.webp"
          alt="Cadernos, papel e embalagens em uma mesa de escritório"
          fill
          sizes="(max-width: 520px) 100vw, 50vw"
        />
      </div>
    </section>
  )
}
