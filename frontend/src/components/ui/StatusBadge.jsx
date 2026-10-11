const variants = {
  neutral: '',
  success: 'status-success',
  danger: 'status-danger',
  accent: 'status-accent',
}
export default function StatusBadge({ children, variant = 'neutral' }) {
  return <span className={`status-badge ${variants[variant] || ''}`}>{children}</span>
}
