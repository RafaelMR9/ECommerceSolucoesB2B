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
        title={user.is_superuser ? 'Atendimento' : 'Meu Suporte'}
        description="Converse com a equipe e acompanhe o histórico das solicitações."
        actions={
          !user.is_superuser && <Button href="/support/send-ticket">Abrir Solicitação</Button>
        }
      />
      {tickets.length ? (
        <div className="grid grid-cols-2 gap-4.5 max-[640px]:grid-cols-1">
          {tickets.map((ticket) => (
            <Link
              href={`/support/${ticket.id}`}
              className="min-w-0 bg-white border border-brand-border border-t-3 border-t-[#af8fce] rounded-panel p-6 flex gap-[17px] items-start transition-colors duration-150 hover:border-brand-accent hover:bg-[#f8f1ff]"
              key={ticket.id}
            >
              <MessageSquare className="text-brand-accent shrink-0" size={23} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <h2 className="font-bold tracking-[-0.5px] text-base">{ticket.subject}</h2>
                <p className="[overflow-wrap:anywhere] text-ui text-brand-muted mt-[7px] overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                  {ticket.content}
                </p>
                <p className="[overflow-wrap:anywhere] text-ui text-brand-muted mt-[7px]">
                  #{ticket.id} · {date(ticket.dateHour, true)}
                </p>
              </div>
              <ArrowUpRight
                className="text-brand-accent shrink-0 ml-auto"
                size={17}
                aria-hidden="true"
              />
            </Link>
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
