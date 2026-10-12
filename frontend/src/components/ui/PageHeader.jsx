import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
export default function PageHeader({ title, description, eyebrow, back, actions }) {
  return (
    <header className="page-header">
      <div>
        {back && (
          <Link className="back-link" href={back.href}>
            <ArrowLeft size={15} aria-hidden="true" />
            {back.label || 'Voltar'}
          </Link>
        )}
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p className="page-description">{description}</p>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </header>
  )
}
