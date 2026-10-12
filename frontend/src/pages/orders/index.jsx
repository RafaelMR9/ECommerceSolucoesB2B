import { useContext } from 'react'
import { Repeat2, Package, Truck } from 'lucide-react'
import BaseLayout from '@/components/shared/BaseLayout'
import PageHeader from '@/components/ui/PageHeader'
import FeatureLink from '@/components/ui/FeatureLink'
import { AuthContext } from '@/contexts/authContext'
import { withSession } from '@/lib/server/page'
export default function Orders() {
  const { user } = useContext(AuthContext)
  return (
    <BaseLayout>
      <PageHeader
        title="Pedidos"
        description="Acompanhe as compras da sua organização e planeje os próximos passos."
      />
      {user.is_superuser && (
        <h2 className="text-[23px] font-extrabold tracking-[-0.8px] mb-5">
          Organizações Compradoras
        </h2>
      )}
      <div className="grid grid-cols-2 gap-4.5 max-[640px]:grid-cols-1">
        <FeatureLink
          href={user.is_superuser ? '/orders/adm-recurring-orders' : '/orders/recurring-orders'}
          icon={Repeat2}
          title="Pedidos Recorrentes"
          description="Compras programadas para acompanhar sua rotina."
        />
        <FeatureLink
          href={
            user.is_superuser ? '/orders/adm-non-recurring-orders' : '/orders/non-recurring-orders'
          }
          icon={Package}
          title="Pedidos Avulsos"
          description="Compras pontuais e o andamento de cada entrega."
        />
      </div>
      {user.is_superuser && (
        <>
          <h2 className="text-[23px] font-extrabold tracking-[-0.8px] mt-9 mb-5">Fornecedores</h2>
          <div className="grid grid-cols-2 gap-4.5 max-[640px]:grid-cols-1">
            <FeatureLink
              href="/orders/suppliers-recurring-orders"
              icon={Repeat2}
              title="Reposição Recorrente"
              description="Acompanhe as entregas programadas dos fornecedores."
            />
            <FeatureLink
              href="/orders/suppliers-non-recurring-orders"
              icon={Truck}
              title="Reposição Avulsa"
              description="Recebimentos pontuais para abastecer o catálogo."
            />
          </div>
        </>
      )}
    </BaseLayout>
  )
}
export const getServerSideProps = withSession()
