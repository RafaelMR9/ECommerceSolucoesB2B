import { PackageOpen } from 'lucide-react'
export default function EmptyState({
  title = 'Nenhum resultado por aqui',
  description,
  action,
  icon: Icon = PackageOpen,
}) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Icon size={26} aria-hidden="true" />
      </span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      {action}
    </div>
  )
}
