import { Building2, ContactRound, Mail, MapPin, UserRound } from 'lucide-react'
import StatusBadge from '@/components/ui/StatusBadge'
import DetailItem from '@/components/ui/DetailItem'

export default function ProfileDetails({ user }) {
  const details = [
    ['Usuário', user.username, UserRound],
    ['E-mail', user.email, Mail],
    ...(user.is_superuser
      ? [['CPF', user.cpf, ContactRound]]
      : [
          ['CNPJ', user.cnpj, Building2],
          ['Endereço', user.address, MapPin],
        ]),
  ]
  return (
    <section
      className="bg-brand-surface border border-brand-border rounded-panel p-[25px] shadow-panel min-w-0 max-[640px]:p-5"
      aria-labelledby="profile-details-title"
    >
      <div className="flex items-center gap-[13px] pb-[21px] border-b border-b-brand-border mb-6">
        <span className="grid place-items-center w-[46px] h-[46px] shrink-0 rounded-[13px] bg-brand-accent-soft text-brand-accent">
          <ContactRound size={22} aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-[19px] font-extrabold tracking-[-0.4px]" id="profile-details-title">
            Dados do Cadastro
          </h2>
          <p className="text-brand-muted text-small mt-[5px]">
            Informações da sua {user.is_superuser ? 'conta administrativa' : 'organização'}.
          </p>
        </div>
      </div>
      <dl className="grid grid-cols-2 gap-[22px] max-[600px]:grid-cols-1">
        {details.map(([label, value, Icon]) => (
          <DetailItem key={label} label={label} icon={Icon}>
            {value || 'Não informado'}
          </DetailItem>
        ))}
      </dl>
      {!user.is_superuser && (
        <div className="rounded-xl bg-[#f8f3fd] border border-[#e3d4f0] p-[19px] mt-[27px]">
          <h3 className="text-ui font-bold mb-[17px]">Condições de Compra</h3>
          <dl className="grid grid-cols-2 gap-4.5 max-[600px]:grid-cols-1">
            <div>
              <dt className="text-brand-muted text-small mb-[9px]">Compras Faturadas</dt>
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
              <dt className="text-brand-muted text-small mb-[9px]">Permissão de Compra</dt>
              <dd>
                <StatusBadge variant={user.canPurchase ? 'success' : 'danger'}>
                  {user.canPurchase ? 'Disponível' : 'Pagamentos pendentes'}
                </StatusBadge>
              </dd>
            </div>
          </dl>
        </div>
      )}
    </section>
  )
}
