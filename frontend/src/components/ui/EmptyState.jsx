import { PackageOpen } from 'lucide-react'
export default function EmptyState({
  title = 'Nenhum resultado por aqui',
  description,
  action,
  icon: Icon = PackageOpen,
  heading: Heading = 'h2',
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-13 px-5.5 bg-brand-surface border border-[#d4bee8] rounded-panel gap-3">
      <span className="p-3.5 bg-brand-accent-soft text-brand-accent rounded-[15px]">
        <Icon size={26} aria-hidden="true" />
      </span>
      <Heading className="text-[18px] font-bold tracking-[-0.4px]">{title}</Heading>
      {description && <p className="text-ui text-brand-muted max-w-105">{description}</p>}
      {action && <div className="mt-1.5">{action}</div>}
    </div>
  )
}
