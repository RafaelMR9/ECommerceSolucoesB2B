import BaseLayout from '@/components/shared/BaseLayout'
import PageHeader from '@/components/ui/PageHeader'
import OrdersTable from '@/components/orders/OrdersTable'
import { withSession } from '@/lib/server/page'
import { loadOrders } from '@/lib/server/orderLoaders'
export default function Orders(props) {
  return (
    <BaseLayout>
      <PageHeader
        title="Pedidos Recorrentes das Organizações"
        description="Acompanhe o andamento e os detalhes dos pedidos."
        back={{ href: '/orders', label: 'Pedidos' }}
      />
      <OrdersTable {...props} supplier={false} admin={true} recurring={true} payments={false} />
    </BaseLayout>
  )
}
export const getServerSideProps = withSession(
  (context) =>
    loadOrders(context, { supplier: false, admin: true, recurring: true, payments: false }),
  { admin: true }
)
