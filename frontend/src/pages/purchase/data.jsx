import PurchaseLayout from '@/components/checkout/PurchaseLayout'
import OrderSummary from '@/components/checkout/OrderSummary'
import BaseLayout from '@/components/shared/BaseLayout'
import PageHeader from '@/components/ui/PageHeader'
import CheckoutForm from '@/components/checkout/CheckoutForm'
import { withSession } from '@/lib/server/page'
import { loadCart } from '@/lib/server/orderLoaders'
export default function PurchaseData({ items, initialUser }) {
  const total = items.reduce(
    (sum, item) => sum + Number(initialUser.is_superuser ? item.costPrice : item.salePrice),
    0
  )
  return (
    <BaseLayout>
      <PageHeader
        title="Finalizar Pedido"
        description="Confira a entrega e a forma de pagamento."
        back={{ href: '/cart', label: 'Carrinho' }}
      />
      <PurchaseLayout
        summary={
          <OrderSummary
            total={total}
            description={`${items.length} ${items.length === 1 ? 'item' : 'itens'} no carrinho`}
          >
            <p className="text-small text-brand-muted">
              Os valores serão conferidos pela plataforma ao finalizar.
            </p>
          </OrderSummary>
        }
      >
        <CheckoutForm />
      </PurchaseLayout>
    </BaseLayout>
  )
}
export const getServerSideProps = withSession(async (context) => {
  const cart = await loadCart(context)
  return cart.items.length ? cart : { redirect: { destination: '/cart', permanent: false } }
})
