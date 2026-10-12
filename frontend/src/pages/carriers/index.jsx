import BaseLayout from '@/components/shared/BaseLayout'
import PartnerList from '@/components/partners/PartnerList'
import { withSession } from '@/lib/server/page'
import { loadPartners } from '@/lib/server/partnerLoaders'
export default function Partners(props) {
  return (
    <BaseLayout>
      <PartnerList kind="carriers" {...props} />
    </BaseLayout>
  )
}
export const getServerSideProps = withSession((context) => loadPartners(context, 'carriers'), {
  admin: true,
})
