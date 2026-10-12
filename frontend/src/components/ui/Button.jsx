import Link from 'next/link'
import { cn } from '@/lib/classes'

const variants = {
  primary:
    'border-transparent bg-brand-accent text-white enabled:hover:bg-brand-accent-hover enabled:active:bg-brand-accent-hover',
  secondary:
    'border-[#bfa1df] bg-[#f8f3ff] text-[#6023af] enabled:hover:border-[#9363c8] enabled:hover:bg-[#eadefa] enabled:active:bg-[#eadefa]',
  danger:
    'border-[#f1cbd3] bg-brand-danger-soft text-brand-danger enabled:hover:bg-[#ffe3e9] enabled:active:bg-[#ffe3e9]',
  ghost:
    'border-transparent bg-transparent text-brand-accent enabled:hover:bg-brand-accent-soft enabled:active:bg-brand-accent-soft',
  inverse:
    'border-[#71588a] bg-[#24172ccc] text-[#f3eafd] focus-visible:outline-brand-focus-light enabled:hover:border-brand-focus-light enabled:hover:bg-[#3a2550] enabled:active:bg-[#3a2550]',
}
// Links have no :enabled state, so their hover utilities are explicit.
const linkVariants = {
  primary: 'hover:bg-brand-accent-hover active:bg-brand-accent-hover',
  secondary: 'hover:border-[#9363c8] hover:bg-[#eadefa] active:bg-[#eadefa]',
  danger: 'hover:bg-[#ffe3e9] active:bg-[#ffe3e9]',
  ghost: 'hover:bg-brand-accent-soft active:bg-brand-accent-soft',
  inverse: 'hover:border-brand-focus-light hover:bg-[#3a2550] active:bg-[#3a2550]',
}
export default function Button({
  href,
  variant = 'primary',
  size = 'default',
  className = '',
  children,
  disabled,
  ...props
}) {
  const tone = variants[variant] ? variant : 'primary'
  const classes = cn(
    'inline-flex min-h-11 items-center justify-center gap-2 whitespace-normal rounded-lg border px-[17px] py-2.5 text-ui font-semibold no-underline transition-colors disabled:cursor-not-allowed disabled:opacity-55 [&_svg]:shrink-0',
    variants[tone],
    href && !disabled && linkVariants[tone],
    size === 'small' && 'px-[11px] py-[7px] text-small',
    className
  )
  if (href && disabled)
    return (
      <span className={cn(classes, 'opacity-50')} aria-disabled="true">
        {children}
      </span>
    )
  return href ? (
    <Link href={href} className={classes} {...props}>
      {children}
    </Link>
  ) : (
    <button type="button" disabled={disabled} className={classes} {...props}>
      {children}
    </button>
  )
}
