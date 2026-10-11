import { useContext, useState } from 'react'
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
      <div className="conversation">
        <section
          className="overflow-hidden rounded-xl border border-gray-200"
          aria-label="Histórico da Conversa"
        >
          {[ticket, ...responses].map((response) => (
            <article
              key={response.id}
              className={`conversation-message ${response.sender === user.id ? 'is-mine' : ''}`}
            >
              <header className="conversation-meta">
                <strong>
                  {response.sender === user.id
                    ? 'Você'
                    : user.is_superuser
                      ? 'Organização compradora'
                      : 'Atendimento'}
                </strong>
                <time dateTime={response.dateHour}>{date(response.dateHour, true)}</time>
              </header>
              <p>{response.content}</p>
            </article>
          ))}
        </section>
        <form className="form-panel conversation-reply" onSubmit={submit}>
          <Alert>{error}</Alert>
          <Field
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
        </form>
      </div>
    </BaseLayout>
  )
}
export const getServerSideProps = withSession(async ({ api, params, user }) => {
  if (!/^\d+$/.test(params.ticketId)) return { notFound: true }
  const ticket = await api(`support/${params.ticketId}/detail/`)
  if (!user.is_superuser && ticket.sender !== user.id && ticket.recipient !== user.id)
    return { notFound: true }
  return { ticket, responses: await api(`support/${params.ticketId}/responses/`) }
})
