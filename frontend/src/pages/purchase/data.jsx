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
        title="Finalizar Pedido"
        description="Confira a entrega e a forma de pagamento."
        back={{ href: '/cart', label: 'Carrinho' }}
      />
      <div className="grid grid-cols-[minmax(0,_1fr)_340px] gap-[26px] items-start max-[1050px]:grid-cols-[minmax(0,_1fr)_280px] max-[760px]:grid-cols-1">
        <CheckoutForm />
        <aside className="bg-brand-surface border border-brand-border rounded-panel p-[25px] shadow-panel max-[640px]:p-5">
          <h2 className="text-[18px] font-bold mb-4.5">Resumo do Pedido</h2>
          <p className="text-sm text-gray-500">
            {items.length} {items.length === 1 ? 'item' : 'itens'} no carrinho
          </p>
          <div className="flex flex-wrap gap-5 justify-between items-center text-[15px] my-[23px] mx-0">
            <span>Total</span>
            <strong className="text-brand-accent text-[27px] font-extrabold">{money(total)}</strong>
          </div>
          <p className="text-sm text-gray-500">
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
