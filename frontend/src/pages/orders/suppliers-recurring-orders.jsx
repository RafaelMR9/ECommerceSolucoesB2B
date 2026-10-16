import BaseLayout from '@/components/shared/BaseLayout'
import PageHeader from '@/components/ui/PageHeader'
import OrdersTable from '@/components/orders/OrdersTable'
import { withSession } from '@/lib/server/page'
import { loadOrders } from '@/lib/server/orderLoaders'
export default function Orders(props) {
  return (
    <BaseLayout>
      <PageHeader
        title="Pedidos Recorrentes de Fornecedores"
        description="Acompanhe o andamento e os detalhes dos pedidos."
        back={{ href: '/orders', label: 'Pedidos' }}
      />
      <OrdersTable {...props} supplier recurring />
    </BaseLayout>
  )
}
export const getServerSideProps = withSession(
  (context) => loadOrders(context, { supplier: true, recurring: true }),
  { admin: true }
)
