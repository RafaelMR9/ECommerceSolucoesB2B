import { ArrowRight, Building2, FlaskConical, Warehouse } from 'lucide-react'
import Button from '@/components/ui/Button'

const profiles = {
  buyer: {
    title: 'Organização Compradora',
    description: 'Escolha produtos, monte o carrinho e acompanhe seus pedidos.',
    action: 'Entrar como Compradora',
    icon: Building2,
  },
  admin: {
    title: 'Organização Atacadista',
    description:
      'Esta é a conta de administrador (superusuário). Gerencie produtos, estoque, pedidos e atendimento.',
    action: 'Entrar como Atacadista',
    icon: Warehouse,
  },
}

export default function DemoAccess({ accounts, onLogin, disabled }) {
  if (!accounts.length) return null

  return (
    <aside
      className="mt-7 rounded-2xl border border-brand-border bg-brand-accent-soft/50 p-4 sm:p-5"
      aria-labelledby="demo-title"
    >
      <div className="mb-3 flex items-center gap-2 text-small font-semibold text-brand-accent">
        <FlaskConical size={18} aria-hidden="true" />
        Demonstração do Projeto
      </div>
      <h2 id="demo-title" className="text-lg font-bold tracking-tight text-brand-ink">
        Conheça os Dois Lados da Plataforma
      </h2>
      <p className="mt-2 text-small leading-6 text-brand-muted">
        Você pode testar sem criar uma conta. Escolha um perfil para começar.
      </p>
      <div className="mt-4 grid gap-3">
        {accounts.map(({ role, username, password }) => {
          const profile = profiles[role]
          const Icon = profile.icon
          return (
            <div key={role} className="rounded-xl border border-brand-border bg-white p-4">
              <div className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-accent-soft text-brand-accent">
                  <Icon size={21} aria-hidden="true" />
                </span>
                <h3 className="text-ui font-bold text-brand-ink">{profile.title}</h3>
              </div>
              <p className="mt-3 text-small leading-6 text-brand-muted">{profile.description}</p>
              <dl className="mt-3 grid gap-1 text-small">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <dt className="text-brand-muted">Usuário:</dt>
                  <dd className="break-all font-semibold text-brand-ink">{username}</dd>
                </div>
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <dt className="text-brand-muted">Senha:</dt>
                  <dd className="break-all font-semibold text-brand-ink">{password}</dd>
                </div>
              </dl>
              <Button
                variant="secondary"
                className="mt-4 w-full"
                disabled={disabled}
                onClick={() => onLogin({ username, password })}
              >
                {profile.action}
                <ArrowRight size={17} aria-hidden="true" />
              </Button>
            </div>
          )
        })}
      </div>
      <p className="mt-3 text-caption leading-5 text-brand-muted">
        As contas são públicas e compartilhadas. Use apenas dados fictícios durante os testes.
      </p>
    </aside>
  )
}
