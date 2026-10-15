import { cn } from '@/lib/classes'

export default function FormActions({ children, className }) {
  return (
    <div
      className={cn(
        'mt-3 flex flex-wrap items-center gap-2.5 border-t border-brand-border pt-5.5 max-[640px]:flex-col max-[640px]:items-stretch',
        className
      )}
    >
      {children}
    </div>
  )
}
