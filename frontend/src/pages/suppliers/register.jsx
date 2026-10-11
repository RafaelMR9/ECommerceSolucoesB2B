import BaseLayout from '@/components/shared/BaseLayout'
import PageHeader from '@/components/ui/PageHeader'
import PartnerForm from '@/components/partners/PartnerForm'
import { withSession } from '@/lib/server/page'
export default function Partner(props) {
  return (
    <BaseLayout>
      <PageHeader
        title="Cadastrar Fornecedor"
        back={{ href: '/suppliers', label: 'Fornecedores' }}
      />
      <PartnerForm kind="suppliers" {...props} />
    </BaseLayout>
  )
}
export const getServerSideProps = withSession(
  async ({ api, query }) => {
    return {}
  },
  { admin: true }
)
