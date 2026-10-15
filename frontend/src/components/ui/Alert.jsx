import { CircleAlert, CircleCheck } from 'lucide-react'
import { cn } from '@/lib/classes'
const variants = {
  error: 'border-[#f0cdd5] bg-brand-danger-soft text-brand-danger',
  success: 'border-[#c9e7d8] bg-brand-success-soft text-brand-success',
  info: 'border-[#e2d3f7] bg-brand-accent-soft text-[#6132a5]',
}
export default function Alert({ children, variant = 'error', className }) {
  if (!children) return null
  const Icon = variant === 'success' ? CircleCheck : CircleAlert
  return (
    <div
      className={cn(
        'mb-5 flex items-start gap-2.5 whitespace-pre-line rounded-[9px] border px-4 py-3.5 text-ui',
        variants[variant] || variants.error,
        className
      )}
      role={variant === 'error' ? 'alert' : 'status'}
    >
      <Icon className="mt-px shrink-0" size={18} aria-hidden="true" />
      <div className="min-w-0 wrap-anywhere">{children}</div>
    </div>
  )
}
