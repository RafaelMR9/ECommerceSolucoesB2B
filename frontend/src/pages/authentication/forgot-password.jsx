import { useState } from 'react'
import AuthLayout from '@/components/shared/AuthLayout'
import Button from '@/components/ui/Button'
import Field from '@/components/ui/Field'
import Alert from '@/components/ui/Alert'
import { sendResetPasswordEmail } from '@/services/authService'
import { withSession } from '@/lib/server/page'
import { errorMessage } from '@/lib/format'
export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(e) {
    e.preventDefault()
    if (busy) return
    setError('')
    setSuccess('')
    setBusy(true)
    try {
      const data = await sendResetPasswordEmail(email)
      if (data.status === 'error') setError(data.message)
      else setSuccess(data.message)
    } catch (e) {
      setError(errorMessage(e))
    } finally {
      setBusy(false)
    }
  }
  return (
    <AuthLayout
      title="Vamos Recuperar Seu Acesso"
      description="Informe o e-mail da sua conta para receber as instruções de redefinição."
    >
      <form onSubmit={submit}>
        <Alert>{error}</Alert>
        <Alert variant="success">{success}</Alert>
        <Field
          name="email"
          type="email"
          label="E-mail da Conta"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" className="w-full" loading={busy}>
          Enviar Instruções
        </Button>
      </form>
      <div className="flex justify-between gap-3.75 items-center flex-wrap text-small my-4.5 mx-0">
        <Button href="/authentication" variant="ghost" disabled={busy}>
          Voltar para Entrar
        </Button>
      </div>
    </AuthLayout>
  )
}
export const getServerSideProps = withSession(undefined, { authPage: true })
