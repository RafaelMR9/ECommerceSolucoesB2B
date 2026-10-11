import { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import BaseLayout from '@/components/shared/BaseLayout'
import PageHeader from '@/components/ui/PageHeader'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import StatusBadge from '@/components/ui/StatusBadge'
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
  const details = [
    ['Usuário', user.username],
    ['E-mail', user.email],
    ...(user.is_superuser
      ? [['CPF', user.cpf]]
      : [
          ['CNPJ', user.cnpj],
          ['Endereço', user.address],
        ]),
  ]
  return (
    <BaseLayout>
      <PageHeader
        title="Minha conta"
        description="Seus dados e as informações da sua organização."
      />
      <Alert>{error}</Alert>
      <section className="panel">
        <div className="profile-summary">
          <span className="profile-avatar" aria-hidden="true">
            {(user.name || user.username).slice(0, 2).toUpperCase()}
          </span>
          <div>
            <h2>{user.name || user.username}</h2>
            <p>{user.is_superuser ? 'Administração da plataforma' : 'Organização compradora'}</p>
          </div>
        </div>
        <dl className="profile-grid">
          {details.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value || '—'}</dd>
            </div>
          ))}
          {!user.is_superuser && (
            <>
              <div>
                <dt>Compras faturadas</dt>
                <dd>
                  <StatusBadge variant={user.authorizeFature ? 'success' : 'neutral'}>
                    {user.authorizeFature
                      ? 'Autorizadas'
                      : user.authorizeFature === false
                        ? 'Em análise'
                        : 'Não solicitadas'}
                  </StatusBadge>
                </dd>
              </div>
              <div>
                <dt>Permissão de compra</dt>
                <dd>
                  <StatusBadge variant={user.canPurchase ? 'success' : 'danger'}>
                    {user.canPurchase ? 'Disponível' : 'Pagamentos pendentes'}
                  </StatusBadge>
                </dd>
              </div>
            </>
          )}
        </dl>
        <div className="profile-actions">
          <Button href="/profile/update">Editar cadastro</Button>
          <Button variant="danger" onClick={logout} disabled={busy}>
            {busy ? 'Saindo…' : 'Sair da conta'}
          </Button>
        </div>
      </section>
    </BaseLayout>
  )
}
export const getServerSideProps = withSession()
