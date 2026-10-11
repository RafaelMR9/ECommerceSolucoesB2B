import BaseLayout from '@/components/shared/BaseLayout'
import PageHeader from '@/components/ui/PageHeader'
import PartnerForm from '@/components/partners/PartnerForm'
import { withSession } from '@/lib/server/page'
export default function Partner(props) {
  return (
    <BaseLayout>
      <PageHeader
        title="Editar transportadora"
        back={{ href: '/carriers', label: 'Transportadoras' }}
      />
      <PartnerForm kind="carriers" {...props} />
    </BaseLayout>
  )
}
export const getServerSideProps = withSession(
  async ({ api, query }) => {
    if (!/^\d+$/.test(query.carrierId || '')) return { notFound: true }
    const partner = await api(`carriers/${query.carrierId}/detail/`)
    return { partner }
  },
  { admin: true }
)
