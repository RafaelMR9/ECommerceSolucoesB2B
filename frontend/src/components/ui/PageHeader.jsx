import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
export default function PageHeader({ title, description, eyebrow, back, actions }) {
  return (
    <header className="relative pb-6 border-b border-b-brand-border flex items-start justify-between gap-6 mb-7 flex-wrap max-[640px]:gap-4 after:content-[''] after:absolute after:bottom-[-1px] after:left-0 after:w-16 after:h-[3px] after:rounded-[3px] after:bg-brand-accent">
      <div className="min-w-0">
        {back && (
          <Link
            className="inline-flex gap-1.5 items-center text-small text-brand-muted mb-[17px] hover:text-brand-accent"
            href={back.href}
          >
            <ArrowLeft size={15} aria-hidden="true" />
            {back.label || 'Voltar'}
          </Link>
        )}
        {eyebrow && (
          <p className="text-brand-accent text-caption font-extrabold tracking-[1.2px] normal-case mb-2.5">
            {eyebrow}
          </p>
        )}
        <h1 className="text-[clamp(25px,_3vw,_34px)] font-extrabold leading-[1.2] tracking-[-1.1px] text-brand-ink">
          {title}
        </h1>
        {description && (
          <p className="text-brand-muted text-body mt-2.5 max-w-[650px]">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex min-w-0 flex-wrap items-center gap-[9px] max-[640px]:w-full max-[640px]:[&>a]:grow max-[640px]:[&>button]:grow max-[640px]:[&>form]:w-full">
          {actions}
        </div>
      )}
    </header>
  )
}
