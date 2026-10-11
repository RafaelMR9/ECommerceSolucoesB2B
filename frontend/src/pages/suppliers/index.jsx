import BaseLayout from '@/components/shared/BaseLayout'
import PartnerList from '@/components/partners/PartnerList'
import { withSession } from '@/lib/server/page'
export default function Partners(props) {
  return (
    <BaseLayout>
      <PartnerList kind="suppliers" {...props} />
    </BaseLayout>
  )
}
export const getServerSideProps = withSession(
  async ({ api, query }) => {
    const all = await api('suppliers/')
    const search =
      typeof query.search === 'string'
        ? query.search
        : query.fetchSuppliers || query.fetchCarriers || ''
    return {
      partners: all.filter((p) =>
        p.name.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR'))
      ),
      search,
    }
  },
  { admin: true }
)
