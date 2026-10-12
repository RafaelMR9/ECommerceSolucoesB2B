import { Repeat2, Receipt } from 'lucide-react'
import BaseLayout from '@/components/shared/BaseLayout'
import PageHeader from '@/components/ui/PageHeader'
import FeatureLink from '@/components/ui/FeatureLink'
import { withSession } from '@/lib/server/page'
export default function Payments() {
  return (
    <BaseLayout>
      <PageHeader
        title="Pagamentos"
        eyebrow="Administração"
        description="Acompanhe pagamentos e pendências das organizações compradoras."
      />
      <div className="grid grid-cols-2 gap-4.5 max-[640px]:grid-cols-1">
        <FeatureLink
          href="/payments/recurring-payments"
          icon={Repeat2}
          title="Pagamentos Recorrentes"
          description="Controle os pagamentos das compras programadas."
        />
        <FeatureLink
          href="/payments/non-recurring-payments"
          icon={Receipt}
          title="Pagamentos Avulsos"
          description="Confira os pagamentos dos pedidos pontuais."
        />
      </div>
    </BaseLayout>
  )
}
export const getServerSideProps = withSession(undefined, { admin: true })
