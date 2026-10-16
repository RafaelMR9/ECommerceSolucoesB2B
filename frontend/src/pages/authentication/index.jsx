import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { loginUser } from '@/services/authService'
import AuthLayout from '@/components/shared/AuthLayout'
import Button from '@/components/ui/Button'
import Field from '@/components/ui/Field'
import Alert from '@/components/ui/Alert'
import DemoAccess from '@/components/authentication/DemoAccess'
import { withSession } from '@/lib/server/page'
import { errorFields } from '@/lib/format'

export default function Login({ demoAccounts = [] }) {
  const router = useRouter()
  const [values, setValues] = useState({ username: '', password: '' }),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false)
  async function signIn(credentials) {
    if (busy) return
    setError('')
    setBusy(true)
    try {
      await loginUser(credentials)
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
      title="Bom Ter Você por Aqui"
      description="Entre na sua conta para acompanhar pedidos, encontrar produtos e cuidar da rotina da sua empresa."
    >
      <form
        onSubmit={(e) => {
          e.preventDefault()
          signIn(values)
        }}
      >
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
        <div className="flex justify-between gap-3.75 items-center flex-wrap text-small my-4.5 mx-0">
          <span>Seu acesso à plataforma</span>
          <Link className="text-brand-accent" href="/authentication/forgot-password">
            Esqueci Minha Senha
          </Link>
        </div>
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? 'Entrando…' : 'Entrar na Conta'}
        </Button>
      </form>
      <div className="flex items-center gap-3.25 text-caption text-brand-muted mt-6.75 mr-0 mb-5 ml-0 before:content-[''] before:h-px before:flex-1 before:bg-brand-border after:content-[''] after:h-px after:flex-1 after:bg-brand-border">
        Sua empresa ainda não tem uma conta?
      </div>
      <Button href="/authentication/register-account" variant="secondary" className="w-full">
        Criar Conta da Organização
      </Button>
      <DemoAccess accounts={demoAccounts} onLogin={signIn} disabled={busy} />
    </AuthLayout>
  )
}
export const getServerSideProps = withSession(
  async () => {
    const demoAccounts = []
    if (process.env.NODE_ENV === 'production' && process.env.DEMO_MODE === 'true') {
      if (process.env.DEMO_BUYER_USERNAME && process.env.DEMO_BUYER_PASSWORD) {
        demoAccounts.push({
          role: 'buyer',
          username: process.env.DEMO_BUYER_USERNAME,
          password: process.env.DEMO_BUYER_PASSWORD,
        })
      }
      if (process.env.DEMO_ADMIN_USERNAME && process.env.DEMO_ADMIN_PASSWORD) {
        demoAccounts.push({
          role: 'admin',
          username: process.env.DEMO_ADMIN_USERNAME,
          password: process.env.DEMO_ADMIN_PASSWORD,
        })
      }
    }
    return { demoAccounts }
  },
  { authPage: true }
)
