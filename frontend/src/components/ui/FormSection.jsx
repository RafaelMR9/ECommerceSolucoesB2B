import { useId } from 'react'
import { FileText } from 'lucide-react'

export default function FormSection({ title, description, icon: Icon = FileText, children }) {
  const titleId = useId()
  return (
    <section className="form-section" aria-labelledby={titleId}>
      <header className="form-section-heading">
        <span>
          <Icon size={20} aria-hidden="true" />
        </span>
        <div>
          <h2 id={titleId}>{title}</h2>
          {description && <p>{description}</p>}
        </div>
      </header>
      {children}
    </section>
  )
}
