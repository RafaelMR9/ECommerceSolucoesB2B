import BaseLayout from '@/components/shared/BaseLayout'
import PageHeader from '@/components/ui/PageHeader'
import ProductForm from '@/components/products/ProductForm'
import { withSession } from '@/lib/server/page'
export default function UpdateProduct(props) {
  return (
    <BaseLayout>
      <PageHeader
        title="Editar produto"
        description="Atualize as informações e a imagem do produto."
        back={{ href: `/products/${props.product.id}`, label: props.product.name }}
      />
      <ProductForm {...props} />
    </BaseLayout>
  )
}
export const getServerSideProps = withSession(
  async ({ api, query }) => {
    if (!/^\d+$/.test(query.productId || '')) return { notFound: true }
    const [product, categories, suppliers] = await Promise.all([
      api(`products/${query.productId}/detail/`),
      api('products/categories/'),
      api('suppliers/'),
    ])
    return { product, categories, suppliers }
  },
  { admin: true }
)
