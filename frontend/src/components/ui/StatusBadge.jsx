import { cn } from '@/lib/classes'
const variants = {
  neutral: 'bg-[#f1eef5] text-[#70657f]',
  success: 'bg-brand-success-soft text-brand-success',
  danger: 'bg-brand-danger-soft text-brand-danger',
  accent: 'bg-brand-accent-soft text-brand-accent',
}
export default function StatusBadge({ children, variant = 'neutral' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center whitespace-nowrap rounded-full px-2.25 py-1.25 text-caption font-semibold leading-[1.2]',
        variants[variant] || variants.neutral
      )}
    >
      {children}
    </span>
  )
}
