import { Building2, ContactRound, Mail, MapPin, UserRound } from 'lucide-react'
import StatusBadge from '@/components/ui/StatusBadge'

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
    <section className="panel profile-details" aria-labelledby="profile-details-title">
      <div className="profile-section-heading">
        <span className="profile-section-icon">
          <ContactRound size={22} aria-hidden="true" />
        </span>
        <div>
          <h2 id="profile-details-title">Dados do Cadastro</h2>
          <p>Informações da sua {user.is_superuser ? 'conta administrativa' : 'organização'}.</p>
        </div>
      </div>
      <dl className="profile-grid">
        {details.map(([label, value, Icon]) => (
          <div key={label}>
            <dt>
              <Icon size={16} aria-hidden="true" />
              {label}
            </dt>
            <dd>{value || 'Não informado'}</dd>
          </div>
        ))}
      </dl>
      {!user.is_superuser && (
        <div className="profile-purchase-status">
          <h3>Condições de Compra</h3>
          <dl>
            <div>
              <dt>Compras Faturadas</dt>
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
              <dt>Permissão de Compra</dt>
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
