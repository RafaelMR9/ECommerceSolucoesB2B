import BaseLayout from '@/components/shared/BaseLayout'
import PageHeader from '@/components/ui/PageHeader'
import CategoryForm from '@/components/categories/CategoryForm'
import { withSession } from '@/lib/server/page'
export default function RegisterCategory(props) {
  return (
    <BaseLayout>
      <PageHeader title="Cadastrar categoria" back={{ href: '/categories', label: 'Categorias' }} />
      <CategoryForm {...props} />
    </BaseLayout>
  )
}
export const getServerSideProps = withSession(
  async ({ api }) => ({ categories: await api('products/categories/') }),
  { admin: true }
)
