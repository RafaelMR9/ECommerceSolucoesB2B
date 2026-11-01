import FormActions from '@/components/ui/FormActions'
import FormPanel from '@/components/ui/FormPanel'
import { MessagesSquare } from 'lucide-react'
import FormLayout from '@/components/ui/FormLayout'
import FormSection from '@/components/ui/FormSection'
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
  const { user } = useContext(AuthContext)
  const router = useRouter()
  const [values, setValues] = useState({ subject: '', content: '' })
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
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
        subject: `${(user.name || user.username).slice(0, 100)}: ${values.subject}`,
        content: values.content,
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
        title="Abrir Solicitação"
        description="Conte o que você precisa. A conversa ficará registrada no seu suporte."
        back={{ href: '/support', label: 'Meu Suporte' }}
      />
      <FormLayout
        icon={MessagesSquare}
        title="Atendimento Organizado"
        description="Registre sua dúvida e acompanhe a conversa pelo suporte."
        points={[
          { title: 'Assunto', text: 'Resuma o motivo da solicitação.' },
          { title: 'Mensagem', text: 'Inclua os detalhes necessários para o atendimento.' },
          { title: 'Histórico', text: 'As respostas ficam reunidas na conversa do ticket.' },
        ]}
      >
        <FormPanel wide onSubmit={submit}>
          <FormSection
            icon={MessagesSquare}
            title="Sua Solicitação"
            description="Explique o que você precisa."
          >
            <Alert>{errors.detail}</Alert>
            <Field
              tone="tinted"
              name="subject"
              label="Assunto"
              minLength={5}
              maxLength={150}
              value={values.subject}
              onChange={change}
              error={errors.subject}
              required
            />
            <Field
              tone="tinted"
              name="content"
              label="Sua Mensagem"
              as="textarea"
              rows={6}
              maxLength={300}
              value={values.content}
              onChange={change}
              error={errors.content}
              required
            />
          </FormSection>
          <FormActions>
            <Button type="submit" loading={busy}>
              Enviar Solicitação
            </Button>
            <Button href="/support" variant="secondary" disabled={busy}>
              Cancelar
            </Button>
          </FormActions>
        </FormPanel>
      </FormLayout>
    </BaseLayout>
  )
}
export const getServerSideProps = withSession(async ({ api }) => ({
  administrator: await api('users/admin_id'),
}))
