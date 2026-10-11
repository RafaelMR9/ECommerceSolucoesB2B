import { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { AuthContext } from '@/contexts/authContext'
import { loginUser } from '@/services/authService'
import AuthLayout from '@/components/shared/AuthLayout'
import Button from '@/components/ui/Button'
import Field from '@/components/ui/Field'
import Alert from '@/components/ui/Alert'
import { withSession } from '@/lib/server/page'
import { errorFields } from '@/lib/format'

export default function Login() {
  const router = useRouter(),
    auth = useContext(AuthContext)
  const [values, setValues] = useState({ username: '', password: '' }),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false)
  async function submit(e) {
    e.preventDefault()
    if (busy) return
    setError('')
    setBusy(true)
    try {
      await loginUser(values, auth)
      const next = router.query.next
      await router.push(
        typeof next === 'string' &&
          next.startsWith('/') &&
          !next.startsWith('//') &&
          !next.includes('\\')
          ? next
          : '/'
      )
    } catch (e) {
      setError(Object.values(errorFields(e)).join(' '))
    } finally {
      setBusy(false)
    }
  }
  return (
    <AuthLayout
      title="Bom ter você por aqui"
      description="Entre na sua conta para acompanhar pedidos, encontrar produtos e cuidar da rotina da sua empresa."
    >
      <form onSubmit={submit}>
        <Alert>{error}</Alert>
        <Field
          name="username"
          label="Usuário"
          autoComplete="username"
          value={values.username}
          onChange={(e) => setValues((p) => ({ ...p, username: e.target.value }))}
          required
        />
        <Field
          name="password"
          type="password"
          label="Senha"
          autoComplete="current-password"
          value={values.password}
          onChange={(e) => setValues((p) => ({ ...p, password: e.target.value }))}
          required
        />
        <div className="auth-links">
          <span>Seu acesso à plataforma</span>
          <Link href="/authentication/forgot-password">Esqueci minha senha</Link>
        </div>
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? 'Entrando…' : 'Entrar na conta'}
        </Button>
      </form>
      <div className="auth-divider">Sua empresa ainda não tem uma conta?</div>
      <Button href="/authentication/register-account" variant="secondary" className="w-full">
        Criar conta da organização
      </Button>
      {process.env.NEXT_PUBLIC_DEMO_MODE === 'true' && (
        <aside className="demo-panel">
          <h2>Conheça a demonstração</h2>
          <p>
            Uma conta administrativa está disponível para explorar as ferramentas de gestão. Para
            conhecer a experiência de compra, cadastre uma organização.
          </p>
          {process.env.NEXT_PUBLIC_DEMO_PASSWORD && (
            <div className="demo-credentials">
              <span>
                Usuário: <strong>{process.env.NEXT_PUBLIC_DEMO_USERNAME || 'admin'}</strong>
              </span>
              <span>
                Senha: <strong>{process.env.NEXT_PUBLIC_DEMO_PASSWORD}</strong>
              </span>
            </div>
          )}
        </aside>
      )}
    </AuthLayout>
  )
}
export const getServerSideProps = withSession(undefined, { authPage: true })
