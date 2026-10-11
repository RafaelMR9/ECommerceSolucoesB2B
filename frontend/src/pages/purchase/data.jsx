import BaseLayout from '@/components/shared/BaseLayout'
import PageHeader from '@/components/ui/PageHeader'
import CheckoutForm from '@/components/checkout/CheckoutForm'
import { withSession } from '@/lib/server/page'
import { loadCart } from '@/lib/server/orderLoaders'
import { money } from '@/lib/format'
export default function PurchaseData({ items, initialUser }) {
  const total = items.reduce(
    (sum, item) => sum + Number(initialUser.is_superuser ? item.costPrice : item.salePrice),
    0
  )
  return (
    <BaseLayout>
      <PageHeader
        title="Finalizar pedido"
        description="Confira a entrega e a forma de pagamento."
        back={{ href: '/cart', label: 'Carrinho' }}
      />
      <div className="checkout-layout">
        <CheckoutForm />
        <aside className="panel checkout-summary">
          <h2>Resumo do pedido</h2>
          <p className="text-sm text-gray-500">
            {items.length} {items.length === 1 ? 'item' : 'itens'} no carrinho
          </p>
          <div className="total">
            <span>Total</span>
            <strong>{money(total)}</strong>
          </div>
          <p className="text-xs text-gray-500">
            Os valores serão conferidos pela plataforma ao finalizar.
          </p>
        </aside>
      </div>
    </BaseLayout>
  )
}
export const getServerSideProps = withSession(async (context) => {
  const cart = await loadCart(context)
  return cart.items.length ? cart : { redirect: { destination: '/cart', permanent: false } }
})
