import { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import BaseLayout from '@/components/shared/BaseLayout'
import PageHeader from '@/components/ui/PageHeader'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import { LogOut, Pencil, ShieldCheck, Building2 } from 'lucide-react'
import ProfileDetails from '@/components/profile/ProfileDetails'
import ProfileShortcuts from '@/components/profile/ProfileShortcuts'
import { AuthContext } from '@/contexts/authContext'
import { logoutUser } from '@/services/authService'
import { withSession } from '@/lib/server/page'
export default function Profile() {
  const auth = useContext(AuthContext),
    { user } = auth,
    router = useRouter(),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false)
  async function logout() {
    setBusy(true)
    try {
      await logoutUser()
      await router.push('/authentication')
    } catch (e) {
      setError(e.message)
      setBusy(false)
    }
  }
  const name = user.name || user.username
  const initials = name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  const RoleIcon = user.is_superuser ? ShieldCheck : Building2
  return (
    <BaseLayout>
      <PageHeader
        title="Minha Conta"
        description="Seus dados e as informações da sua organização."
      />
      <Alert>{error}</Alert>
      <section className="profile-cover" aria-label="Resumo da Conta">
        <div className="profile-summary">
          <span className="profile-avatar" aria-hidden="true">
            {initials}
          </span>
          <div>
            <span className="profile-role">
              <RoleIcon size={15} aria-hidden="true" />
              {user.is_superuser ? 'Conta Administrativa' : 'Organização Compradora'}
            </span>
            <h2>{name}</h2>
            <p>
              {user.is_superuser
                ? 'Acompanhe a operação e cuide de cada etapa da loja.'
                : 'Suas compras, seus pedidos e sua empresa conectados.'}
            </p>
          </div>
        </div>
        <div className="profile-actions">
          <Button href="/profile/update">
            <Pencil size={17} aria-hidden="true" />
            Editar Cadastro
          </Button>
          <Button variant="inverse" onClick={logout} disabled={busy}>
            <LogOut size={17} aria-hidden="true" />
            {busy ? 'Saindo…' : 'Sair da Conta'}
          </Button>
        </div>
      </section>
      <div className="profile-layout">
        <ProfileDetails user={user} />
        <ProfileShortcuts admin={user.is_superuser} />
      </div>
    </BaseLayout>
  )
}
export const getServerSideProps = withSession()
