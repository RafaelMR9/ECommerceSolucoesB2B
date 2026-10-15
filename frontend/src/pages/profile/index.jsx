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
  const { user } = useContext(AuthContext),
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
      <section
        className="flex flex-wrap items-center justify-between gap-6 p-8 mb-6 bg-profile bg-[#241630] border border-[#674182] rounded-[18px] text-white max-[600px]:p-6"
        aria-label="Resumo da Conta"
      >
        <div className="flex items-center gap-[22px] min-w-0 flex-[1_1_400px] max-[600px]:flex-wrap max-[600px]:gap-4">
          <span
            className="shrink-0 grid place-items-center w-[86px] h-[86px] rounded-3xl bg-[#50316d] border border-[#a77acd] text-[#ead8ff] text-[30px] font-extrabold max-[600px]:w-16 max-[600px]:h-16 max-[600px]:rounded-[18px] max-[600px]:text-[25px]"
            aria-hidden="true"
          >
            {initials}
          </span>
          <div className="min-w-0">
            <span className="inline-flex items-center gap-[7px] text-[#d5b1ff] text-small font-semibold">
              <RoleIcon size={15} aria-hidden="true" />
              {user.is_superuser ? 'Conta Administrativa' : 'Organização Compradora'}
            </span>
            <h2
              className="line-clamp-3 text-[clamp(23px,_3vw,_30px)] leading-[1.2] font-extrabold tracking-[-0.8px] my-[9px] mx-0 [overflow-wrap:anywhere]"
              title={name}
            >
              {name}
            </h2>
            <p className="text-[#e1d3ed] text-small">
              {user.is_superuser
                ? 'Acompanhe a operação e cuide de cada etapa da loja.'
                : 'Suas compras, seus pedidos e sua empresa conectados.'}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2.5 max-[600px]:w-full">
          <Button className="max-[600px]:flex-[1_1_170px]" href="/profile/update">
            <Pencil className="shrink-0" size={17} aria-hidden="true" />
            Editar Cadastro
          </Button>
          <Button
            className="max-[600px]:flex-[1_1_170px]"
            variant="inverse"
            onClick={logout}
            disabled={busy}
          >
            <LogOut className="shrink-0" size={17} aria-hidden="true" />
            {busy ? 'Saindo…' : 'Sair da Conta'}
          </Button>
        </div>
      </section>
      <div className="grid grid-cols-[minmax(0,_1.5fr)_minmax(0,_1fr)] gap-6 items-start max-[800px]:grid-cols-1">
        <ProfileDetails user={user} />
        <ProfileShortcuts admin={user.is_superuser} />
      </div>
    </BaseLayout>
  )
}
export const getServerSideProps = withSession()
