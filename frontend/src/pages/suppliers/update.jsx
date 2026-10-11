import BaseLayout from '@/components/shared/BaseLayout'
import PageHeader from '@/components/ui/PageHeader'
import PartnerForm from '@/components/partners/PartnerForm'
import { withSession } from '@/lib/server/page'
export default function Partner(props) {
  return (
    <BaseLayout>
      <PageHeader title="Editar fornecedor" back={{ href: '/suppliers', label: 'Fornecedores' }} />
      <PartnerForm kind="suppliers" {...props} />
    </BaseLayout>
  )
}
export const getServerSideProps = withSession(
  async ({ api, query }) => {
    if (!/^\d+$/.test(query.supplierId || '')) return { notFound: true }
    const partner = await api(`suppliers/${query.supplierId}/detail/`)
    return { partner }
  },
  { admin: true }
)
