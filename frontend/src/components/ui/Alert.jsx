import { CircleAlert, CircleCheck } from 'lucide-react'
const variants = { error: '', success: 'alert-success', info: 'alert-info' }
export default function Alert({ children, variant = 'error' }) {
  if (!children) return null
  const Icon = variant === 'success' ? CircleCheck : CircleAlert
  return (
    <div
      className={`alert ${variants[variant] || ''}`}
      role={variant === 'error' ? 'alert' : 'status'}
    >
      <Icon size={18} aria-hidden="true" />
      <div>{children}</div>
    </div>
  )
}
