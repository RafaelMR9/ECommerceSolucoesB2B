import { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import BaseLayout from '@/components/shared/BaseLayout'
import PageHeader from '@/components/ui/PageHeader'
import Button from '@/components/ui/Button'
import Field from '@/components/ui/Field'
import Alert from '@/components/ui/Alert'
import { AuthContext } from '@/contexts/authContext'
import { registerTicket } from '@/services/supportService'
import { errorFields } from '@/lib/format'
import { withSession } from '@/lib/server/page'
export default function SendTicket({ administrator }) {
  const { user } = useContext(AuthContext),
    router = useRouter(),
    [values, setValues] = useState({ subject: '', content: '' }),
    [errors, setErrors] = useState({}),
    [busy, setBusy] = useState(false)
  function change(e) {
    setValues((p) => ({ ...p, [e.target.name]: e.target.value }))
    setErrors((p) => ({ ...p, [e.target.name]: '' }))
  }
  async function submit(e) {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    try {
      await registerTicket({
        subject: `${user.name || user.username}: ${values.subject}`,
        content: values.content,
        sender: user.id,
        recipient: administrator.id,
        answer: null,
      })
      await router.push('/support')
    } catch (error) {
      setErrors(errorFields(error))
    } finally {
      setBusy(false)
    }
  }
  return (
    <BaseLayout>
      <PageHeader
        title="Abrir solicitação"
        description="Conte o que você precisa. A conversa ficará registrada no seu suporte."
        back={{ href: '/support', label: 'Meu suporte' }}
      />
      <form className="form-panel" onSubmit={submit}>
        <Alert>{errors.detail}</Alert>
        <Field
          name="subject"
          label="Assunto"
          value={values.subject}
          onChange={change}
          error={errors.subject}
          required
        />
        <Field
          name="content"
          label="Sua mensagem"
          as="textarea"
          rows={6}
          value={values.content}
          onChange={change}
          error={errors.content}
          required
        />
        <div className="form-actions">
          <Button type="submit" disabled={busy}>
            {busy ? 'Enviando…' : 'Enviar solicitação'}
          </Button>
          <Button href="/support" variant="secondary">
            Cancelar
          </Button>
        </div>
      </form>
    </BaseLayout>
  )
}
export const getServerSideProps = withSession(async ({ api }) => ({
  administrator: await api('users/admin_id'),
}))
