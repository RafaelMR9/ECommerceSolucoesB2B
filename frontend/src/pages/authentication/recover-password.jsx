import { useState } from 'react'
import { useRouter } from 'next/router'
import AuthLayout from '@/components/shared/AuthLayout'
import Button from '@/components/ui/Button'
import Field from '@/components/ui/Field'
import Alert from '@/components/ui/Alert'
import { resetPassword } from '@/services/authService'
import { errorFields } from '@/lib/format'
import { validatePassword } from '@/utils/utils'
import { withSession } from '@/lib/server/page'
export default function RecoverPassword({ token, resetUserId, valid }) {
  const router = useRouter(),
    [values, setValues] = useState({ password: '', confirmPassword: '' }),
    [errors, setErrors] = useState({}),
    [busy, setBusy] = useState(false)
  async function submit(e) {
    e.preventDefault()
    if (busy) return
    const validation = {}
    if (!validatePassword(values.password))
      validation.password = 'Use pelo menos 8 caracteres, incluindo letras.'
    if (values.password !== values.confirmPassword)
      validation.confirmPassword = 'As senhas não coincidem.'
    if (Object.keys(validation).length) {
      setErrors(validation)
      return
    }
    setBusy(true)
    try {
      await resetPassword({ ...values, token }, resetUserId)
      await router.push('/authentication')
    } catch (error) {
      setErrors(errorFields(error))
    } finally {
      setBusy(false)
    }
  }
  return (
    <AuthLayout
      title="Crie Sua Nova Senha"
      description="Escolha uma senha segura para voltar a acessar sua conta."
    >
      {valid ? (
        <form onSubmit={submit}>
          <Alert>{errors.detail}</Alert>
          {[
            ['password', 'Nova senha'],
            ['confirmPassword', 'Confirmar nova senha'],
          ].map(([name, label]) => (
            <Field
              key={name}
              name={name}
              label={label}
              type="password"
              autoComplete="new-password"
              value={values[name]}
              onChange={(e) => {
                setValues((p) => ({ ...p, [name]: e.target.value }))
                setErrors((p) => ({ ...p, [name]: '' }))
              }}
              error={errors[name]}
              required
            />
          ))}
          <Button type="submit" className="w-full" loading={busy}>
            Salvar Nova Senha
          </Button>
        </form>
      ) : (
        <>
          <Alert>Este link é inválido ou expirou. Solicite um novo e-mail de recuperação.</Alert>
          <Button href="/authentication/forgot-password" className="w-full">
            Solicitar Novo Link
          </Button>
        </>
      )}
    </AuthLayout>
  )
}
export const getServerSideProps = withSession(
  async ({ api, query }) => {
    const token = typeof query.token === 'string' ? query.token : ''
    const data = await api(`users/passwordReset/checkExistence/?token=${encodeURIComponent(token)}`)
    return { token, resetUserId: data.user_id || null, valid: Boolean(data.status) }
  },
  { authPage: true }
)
