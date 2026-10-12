import FormPanel from '@/components/ui/FormPanel'
import { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import BaseLayout from '@/components/shared/BaseLayout'
import PageHeader from '@/components/ui/PageHeader'
import Button from '@/components/ui/Button'
import Field from '@/components/ui/Field'
import Alert from '@/components/ui/Alert'
import { AuthContext } from '@/contexts/authContext'
import { addCartItem } from '@/services/checkoutService'
import { errorFields, money } from '@/lib/format'
import { withSession } from '@/lib/server/page'
export default function Purchase({ product, promotion }) {
  const { user } = useContext(AuthContext),
    router = useRouter(),
    [quantity, setQuantity] = useState(1),
    [errors, setErrors] = useState({}),
    [busy, setBusy] = useState(false)
  async function submit(e) {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setErrors({})
    try {
      await addCartItem(product.id, Number(quantity))
      await router.push('/cart')
    } catch (error) {
      setErrors(errorFields(error))
    } finally {
      setBusy(false)
    }
  }
  const price = user.is_superuser ? product.costPrice : (promotion?.salePrice ?? product.salePrice)
  return (
    <BaseLayout>
      <PageHeader
        title={user.is_superuser ? 'Comprar para Reposição' : 'Adicionar ao Carrinho'}
        description={product.name}
        back={{
          href: user.is_superuser ? '/restock' : `/products/${product.id}`,
          label: user.is_superuser ? 'Ressuprimento' : 'Produto',
        }}
      />
      <div className="grid grid-cols-[minmax(0,_1fr)_340px] gap-[26px] items-start max-[1050px]:grid-cols-[minmax(0,_1fr)_280px] max-[760px]:grid-cols-1">
        <FormPanel onSubmit={submit}>
          <Alert>{errors.detail}</Alert>
          <div className="flex items-center gap-3.5 mb-7">
            <div className="relative w-[65px] h-[65px] shrink-0">
              <Image
                className="object-contain"
                src={product.image || '/images/product-placeholder.svg'}
                alt={product.name}
                fill
                unoptimized
              />
            </div>
            <div>
              <h2 className="font-semibold">{product.name}</h2>
              <p className="text-sm text-gray-500">{money(price)} por embalagem</p>
            </div>
          </div>
          <Field
            tone="tinted"
            name="quantity"
            label="Quantidade de Embalagens"
            type="number"
            min={1}
            step={1}
            max={!user.is_superuser ? product.currentStockQuantity : undefined}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            error={errors.quantity}
            hint={`${product.packaging} unidades por embalagem.`}
            required
          />
          <Button
            type="submit"
            disabled={busy || (!user.is_superuser && !product.currentStockQuantity)}
          >
            {busy ? 'Adicionando…' : 'Adicionar ao Carrinho'}
          </Button>
        </FormPanel>
        <aside className="bg-brand-surface border border-brand-border rounded-panel p-[25px] shadow-panel max-[640px]:p-5">
          <h2 className="text-[18px] font-bold mb-4.5">Resumo do Item</h2>
          <p className="text-sm text-gray-500">
            {quantity || 0} embalagens · {Number(quantity || 0) * product.packaging} unidades
          </p>
          <div className="flex flex-wrap gap-5 justify-between items-center text-[15px] my-[23px] mx-0">
            <span>Subtotal</span>
            <strong className="text-brand-accent text-[27px] font-extrabold">
              {money(price * Number(quantity || 0))}
            </strong>
          </div>
          {!user.is_superuser && (
            <p className="text-sm text-gray-500">
              Estoque disponível: {product.currentStockQuantity} embalagens.
            </p>
          )}
        </aside>
      </div>
    </BaseLayout>
  )
}
export const getServerSideProps = withSession(async ({ api, query, user }) => {
  if (!/^\d+$/.test(query.productId || '')) return { notFound: true }
  if (!user.is_superuser && !user.canPurchase)
    return { redirect: { destination: '/profile', permanent: false } }
  const [product, promotion] = await Promise.all([
    api(`products/${query.productId}/detail/`),
    api(`marketing/promotion/${query.productId}/`),
  ])
  if (!product.visible) return { notFound: true }
  return { product, promotion: promotion?.salePrice ? promotion : null }
})
