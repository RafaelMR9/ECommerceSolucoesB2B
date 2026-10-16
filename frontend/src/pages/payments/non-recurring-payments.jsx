import BaseLayout from '@/components/shared/BaseLayout'
import PageHeader from '@/components/ui/PageHeader'
import OrdersTable from '@/components/orders/OrdersTable'
import { withSession } from '@/lib/server/page'
import { loadOrders } from '@/lib/server/orderLoaders'
export default function Orders(props) {
  return (
    <BaseLayout>
      <PageHeader
        title="Pagamentos Avulsos das Organizações"
        description="Acompanhe o andamento e os detalhes dos pedidos."
        back={{ href: '/payments', label: 'Pagamentos' }}
      />
      <OrdersTable {...props} admin payments />
    </BaseLayout>
  )
}
export const getServerSideProps = withSession(
  (context) => loadOrders(context, { admin: true, payments: true }),
  { admin: true }
)
