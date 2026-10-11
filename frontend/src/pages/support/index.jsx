import { useContext } from 'react'
import Link from 'next/link'
import { MessageSquare, ArrowUpRight } from 'lucide-react'
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
        title={user.is_superuser ? 'Atendimento' : 'Meu suporte'}
        description="Converse com a equipe e acompanhe o histórico das solicitações."
        actions={
          !user.is_superuser && <Button href="/support/send-ticket">Abrir solicitação</Button>
        }
      />
      {tickets.length ? (
        <div className="option-grid">
          {tickets.map((ticket) => (
            <Link href={`/support/${ticket.id}`} className="option-card" key={ticket.id}>
              <MessageSquare size={23} aria-hidden="true" />
              <div>
                <h2 className="text-base">{ticket.subject}</h2>
                <p className="line-clamp-2">{ticket.content}</p>
                <p>
                  #{ticket.id} · {date(ticket.dateHour, true)}
                </p>
              </div>
              <ArrowUpRight className="option-arrow" size={17} aria-hidden="true" />
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Nenhuma solicitação por aqui"
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
