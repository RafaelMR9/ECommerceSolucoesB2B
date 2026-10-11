import { Check, FileText } from 'lucide-react'

export default function FormLayout({
  children,
  icon: Icon = FileText,
  title,
  description,
  points = [],
}) {
  return (
    <div className="form-layout">
      <div className="form-layout-content">{children}</div>
      <aside className="form-guide">
        <span className="form-guide-icon">
          <Icon size={28} aria-hidden="true" />
        </span>
        <p className="eyebrow">Para Sua Organização</p>
        <h2>{title}</h2>
        <p>{description}</p>
        <ul>
          {points.map(({ title: pointTitle, text }) => (
            <li key={pointTitle}>
              <Check size={17} aria-hidden="true" />
              <div>
                <h3>{pointTitle}</h3>
                <p>{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  )
}
