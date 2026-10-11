import BaseLayout from '@/components/shared/BaseLayout'
import PageHeader from '@/components/ui/PageHeader'
import ProductForm from '@/components/products/ProductForm'
import { withSession } from '@/lib/server/page'
export default function RegisterProduct(props) {
  return (
    <BaseLayout>
      <PageHeader
        title="Cadastrar Produto"
        description="Adicione um novo essencial ao catálogo."
        back={{ href: '/products', label: 'Catálogo' }}
      />
      <ProductForm {...props} />
    </BaseLayout>
  )
}
export const getServerSideProps = withSession(
  async ({ api }) => {
    const [categories, suppliers] = await Promise.all([
      api('products/categories/'),
      api('suppliers/'),
    ])
    return { categories, suppliers }
  },
  { admin: true }
)
