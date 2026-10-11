import { Repeat2, PackageSearch, MessagesSquare } from 'lucide-react'
const features = [
  { icon: Repeat2, title: 'Pedidos Recorrentes', description: 'Compras que acompanham sua rotina' },
  {
    icon: PackageSearch,
    title: 'Pedidos Organizados',
    description: 'Acompanhe suas compras em um lugar',
  },
  {
    icon: MessagesSquare,
    title: 'Suporte por Tickets',
    description: 'Converse com a equipe de atendimento',
  },
]
export default function ServiceStrip() {
  return (
    <section className="service-strip" aria-label="Recursos da Plataforma">
      <div className="service-strip-inner site-width">
        {features.map(({ icon: Icon, title, description }) => (
          <div className="service-feature" key={title}>
            <Icon size={23} aria-hidden="true" />
            <div>
              <h2>{title}</h2>
              <p>{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
