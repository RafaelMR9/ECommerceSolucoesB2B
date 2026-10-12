import { cn } from '@/lib/classes'

export default function FormPanel({ className, wide = false, children, ...props }) {
  return (
    <form
      className={cn(
        'max-w-[780px] rounded-panel border border-brand-border bg-brand-surface p-7 shadow-panel max-[640px]:p-5',
        wide && 'max-w-none border-t-4 border-t-brand-accent',
        className
      )}
      {...props}
    >
      {children}
    </form>
  )
}
