import { cn } from '@/lib/classes'

export default function DetailItem({ label, icon: Icon, boxed = false, children }) {
  return (
    <div
      className={cn(
        'min-w-0 last:odd:col-span-full',
        boxed &&
          'relative rounded-[10px] border border-brand-border bg-white py-4.25 pr-3.5 pl-10.75 last:odd:col-span-1 max-[520px]:px-3 max-[520px]:py-4'
      )}
    >
      {boxed && Icon && (
        <Icon
          className="absolute left-3.5 top-4.75 text-brand-accent max-[520px]:static max-[520px]:mb-2.5"
          size={19}
          aria-hidden="true"
        />
      )}
      <dt
        className={cn(
          'mb-2.25 flex items-center gap-1.75 text-small text-brand-muted',
          boxed && 'mb-1.5 text-caption'
        )}
      >
        {!boxed && Icon && (
          <Icon className="shrink-0 text-brand-accent" size={16} aria-hidden="true" />
        )}
        {label}
      </dt>
      <dd className={cn('text-body font-semibold wrap-anywhere', boxed && 'text-ui font-bold')}>
        {children}
      </dd>
    </div>
  )
}
