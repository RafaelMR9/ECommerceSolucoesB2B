import { cn } from '@/lib/classes'

export default function Input({
  as: Control = 'input',
  tone = 'plain',
  type,
  className,
  children,
  ...props
}) {
  const classes = cn(
    'block min-h-11 min-w-0 max-w-full w-full rounded-lg border border-[#dbd4e5] bg-white px-3.25 py-2.75 text-body leading-[1.4] text-brand-ink transition-colors placeholder:text-brand-muted hover:border-[#b8a7ce] focus:border-brand-accent focus:outline-solid focus:outline-3 focus:outline-brand-accent/10 focus:outline-offset-1 aria-invalid:border-brand-danger disabled:bg-[#f6f4f8] disabled:text-[#857b91]',
    tone === 'tinted' && 'border-[#cdbedc] bg-[#fcfaff] focus:bg-white',
    type === 'file' &&
      'text-small file:mr-2.5 file:rounded-[5px] file:border-0 file:bg-brand-accent-soft file:px-2.25 file:py-1.25 file:text-brand-accent',
    ['checkbox', 'radio'].includes(type) &&
      'inline-block h-4.5 min-h-0 w-4.5 p-0 align-middle accent-brand-accent',
    className
  )
  if (Control === 'input') return <input type={type} className={classes} {...props} />
  return (
    <Control className={classes} {...props}>
      {children}
    </Control>
  )
}
