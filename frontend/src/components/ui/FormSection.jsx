import { useId } from 'react'
import { FileText } from 'lucide-react'
import { cn } from '@/lib/classes'

export default function FormSection({
  title,
  description,
  icon: Icon = FileText,
  children,
  separated = false,
}) {
  const titleId = useId()
  return (
    <section
      className={cn(separated && 'mt-2 border-t border-brand-border pt-6')}
      aria-labelledby={titleId}
    >
      <header className="flex gap-3.25 items-start mb-6.25 max-[640px]:gap-2.5">
        <span className="grid place-items-center shrink-0 w-10.5 h-10.5 text-brand-accent bg-brand-accent-soft rounded-xl">
          <Icon size={20} aria-hidden="true" />
        </span>
        <div>
          <h2
            className="text-[19px] font-extrabold tracking-[-0.4px] text-brand-ink max-[640px]:text-[18px]"
            id={titleId}
          >
            {title}
          </h2>
          {description && <p className="text-brand-muted text-small mt-1.25">{description}</p>}
        </div>
      </header>
      {children}
    </section>
  )
}
