import BaseLayout from '@/components/shared/BaseLayout'
import PageHeader from '@/components/ui/PageHeader'
import CategoryForm from '@/components/categories/CategoryForm'
import { withSession } from '@/lib/server/page'
export default function UpdateCategory(props) {
  return (
    <BaseLayout>
      <PageHeader title="Editar categoria" back={{ href: '/categories', label: 'Categorias' }} />
      <CategoryForm {...props} />
    </BaseLayout>
  )
}
export const getServerSideProps = withSession(
  async ({ api, query }) => {
    if (!/^\d+$/.test(query.categoryId || '')) return { notFound: true }
    const [category, categories] = await Promise.all([
      api(`products/categories/${query.categoryId}/detail/`),
      api('products/categories/'),
    ])
    return { category, categories }
  },
  { admin: true }
)
