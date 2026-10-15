import { useContext } from 'react'
import FeatureLink from '@/components/ui/FeatureLink'
import { MessageSquare } from 'lucide-react'
import BaseLayout from '@/components/shared/BaseLayout'
import PageHeader from '@/components/ui/PageHeader'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import { AuthContext } from '@/contexts/authContext'
import { date } from '@/lib/format'
import { withSession } from '@/lib/server/page'
export default function Support({ tickets }) {
  const { user } = useContext(AuthContext)
  return (
    <BaseLayout>
      <PageHeader
        title={user.is_superuser ? 'Atendimento' : 'Meu Suporte'}
        description="Converse com a equipe e acompanhe o histórico das solicitações."
        actions={
          !user.is_superuser && <Button href="/support/send-ticket">Abrir Solicitação</Button>
        }
      />
      {tickets.length ? (
        <div className="grid grid-cols-2 gap-4.5 max-[640px]:grid-cols-1">
          {tickets.map((ticket) => (
            <FeatureLink
              href={`/support/${ticket.id}`}
              key={ticket.id}
              icon={MessageSquare}
              title={ticket.subject}
            >
              <p className="mt-1.75 overflow-hidden text-ui text-brand-muted wrap-anywhere [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                {ticket.content}
              </p>
              <p className="mt-1.75 text-small text-brand-muted">
                #{ticket.id} · {date(ticket.dateHour, true)}
              </p>
            </FeatureLink>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Nenhuma Solicitação por Aqui"
          description="O histórico das conversas ficará disponível nesta página."
          icon={MessageSquare}
        />
      )}
    </BaseLayout>
  )
}
export const getServerSideProps = withSession(async ({ api, user }) => ({
  tickets: await api(user.is_superuser ? 'support/' : `support/filter/?user=${user.id}`),
}))
