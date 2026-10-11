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
        title={user.is_superuser ? 'Comprar para reposição' : 'Adicionar ao carrinho'}
        description={product.name}
        back={{
          href: user.is_superuser ? '/restock' : `/products/${product.id}`,
          label: user.is_superuser ? 'Ressuprimento' : 'Produto',
        }}
      />
      <div className="checkout-layout">
        <form className="form-panel" onSubmit={submit}>
          <Alert>{errors.detail}</Alert>
          <div className="checkout-item mb-7">
            <div className="checkout-item-image">
              <Image
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
            name="quantity"
            label="Quantidade de embalagens"
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
            {busy ? 'Adicionando…' : 'Adicionar ao carrinho'}
          </Button>
        </form>
        <aside className="panel checkout-summary">
          <h2>Resumo do item</h2>
          <p className="text-sm text-gray-500">
            {quantity || 0} embalagens · {Number(quantity || 0) * product.packaging} unidades
          </p>
          <div className="total">
            <span>Subtotal</span>
            <strong>{money(price * Number(quantity || 0))}</strong>
          </div>
          {!user.is_superuser && (
            <p className="text-xs text-gray-500">
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
