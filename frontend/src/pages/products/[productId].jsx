import Link from 'next/link'
import { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import BaseLayout from '@/components/shared/BaseLayout'
import ProductOverview from '@/components/products/ProductOverview'
import Alert from '@/components/ui/Alert'
import Modal from '@/components/shared/Modal'
import { AuthContext } from '@/contexts/authContext'
import { removeProduct } from '@/services/productService'
import { activePromotion, errorFields } from '@/lib/format'
import { withSession } from '@/lib/server/page'

export default function Product({ product, category, supplier, promotion }) {
  const { user } = useContext(AuthContext),
    router = useRouter()
  const [confirm, setConfirm] = useState(false),
    [error, setError] = useState('')
  async function remove() {
    try {
      await removeProduct(product.id)
      await router.push('/products')
    } catch (e) {
      setError(Object.values(errorFields(e)).join(' '))
    } finally {
      setConfirm(false)
    }
  }
  return (
    <BaseLayout>
      <Link className="back-link" href="/products">
        ← Voltar ao Catálogo
      </Link>
      <Alert>{error}</Alert>
      <ProductOverview
        product={product}
        category={category}
        supplier={supplier}
        promotion={promotion}
        user={user}
        onRemove={() => setConfirm(true)}
      />
      <Modal
        isOpen={confirm}
        title="Remover Produto"
        message={`Deseja remover “${product.name}” do catálogo?`}
        option1="Remover"
        option2="Cancelar"
        onClose={() => setConfirm(false)}
        onConfirm={remove}
      />
    </BaseLayout>
  )
}
export const getServerSideProps = withSession(async ({ api, params, user }) => {
  if (!/^\d+$/.test(params.productId)) return { notFound: true }
  const product = await api(`products/${params.productId}/detail/`)
  if (!product.visible && !user.is_superuser) return { notFound: true }
  const [category, promotions, supplier] = await Promise.all([
    api(`products/categories/${product.category}/detail/`),
    api('marketing/'),
    user.is_superuser ? api(`suppliers/${product.supplier}/detail/`) : Promise.resolve(null),
  ])
  return {
    product,
    category,
    supplier,
    promotion: activePromotion(product, promotions, Date.now()) || null,
  }
})
