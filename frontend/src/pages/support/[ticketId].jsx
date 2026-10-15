import FormPanel from '@/components/ui/FormPanel'
import { useContext, useState } from 'react'
import { cn } from '@/lib/classes'
import BaseLayout from '@/components/shared/BaseLayout'
import PageHeader from '@/components/ui/PageHeader'
import Button from '@/components/ui/Button'
import Field from '@/components/ui/Field'
import Alert from '@/components/ui/Alert'
import { AuthContext } from '@/contexts/authContext'
import { registerTicket, getTicketResponses } from '@/services/supportService'
import { date, errorFields } from '@/lib/format'
import { withSession } from '@/lib/server/page'
export default function Conversation({ ticket, responses: initialResponses }) {
  const { user } = useContext(AuthContext),
    [responses, setResponses] = useState(initialResponses),
    [message, setMessage] = useState(''),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false)
  async function submit(e) {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setError('')
    try {
      await registerTicket({
        sender: user.id,
        recipient: ticket.sender === user.id ? ticket.recipient : ticket.sender,
        subject: null,
        content: message,
        answer: ticket.id,
      })
      setResponses(await getTicketResponses(ticket.id))
      setMessage('')
    } catch (e) {
      setError(Object.values(errorFields(e)).join(' '))
    } finally {
      setBusy(false)
    }
  }
  return (
    <BaseLayout>
      <PageHeader
        title={ticket.subject}
        description={`Solicitação #${ticket.id} · Aberta em ${date(ticket.dateHour, true)}`}
        back={{ href: '/support', label: 'Atendimento' }}
      />
      <div className="max-w-225">
        <section
          className="overflow-hidden rounded-xl border border-gray-200"
          aria-label="Histórico da Conversa"
        >
          {[ticket, ...responses].map((response) => (
            <article
              key={response.id}
              className={cn(
                'border-b border-brand-border px-5.75 py-5 first:rounded-t-panel last:rounded-b-panel last:border-b-0 max-[520px]:p-4.25',
                response.sender === user.id ? 'bg-[#f5f0fd]' : 'bg-white'
              )}
            >
              <header className="flex items-center gap-2.5 justify-between mb-3 text-caption text-brand-muted max-[520px]:flex-wrap">
                <strong className="text-brand-accent">
                  {response.sender === user.id
                    ? 'Você'
                    : user.is_superuser
                      ? 'Organização compradora'
                      : 'Atendimento'}
                </strong>
                <time dateTime={response.dateHour}>{date(response.dateHour, true)}</time>
              </header>
              <p className="text-body leading-[1.8] whitespace-pre-wrap wrap-anywhere">
                {response.content}
              </p>
            </article>
          ))}
        </section>
        <FormPanel className="mt-6.25" onSubmit={submit}>
          <Alert>{error}</Alert>
          <Field
            tone="tinted"
            as="textarea"
            name="response"
            label="Sua Resposta"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite sua mensagem…"
            required
          />
          <Button type="submit" disabled={busy}>
            {busy ? 'Enviando…' : 'Enviar Resposta'}
          </Button>
        </FormPanel>
      </div>
    </BaseLayout>
  )
}
export const getServerSideProps = withSession(async ({ api, params, user }) => {
  if (!/^\d+$/.test(params.ticketId)) return { notFound: true }
  const [ticket, responses] = await Promise.all([
    api(`support/${params.ticketId}/detail/`),
    api(`support/${params.ticketId}/responses/`),
  ])
  if (!user.is_superuser && ticket.sender !== user.id && ticket.recipient !== user.id)
    return { notFound: true }
  return { ticket, responses }
})
