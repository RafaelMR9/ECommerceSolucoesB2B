import Link from 'next/link'
const variants = {
  primary: 'button-primary',
  secondary: 'button-secondary',
  danger: 'button-danger',
  ghost: 'button-ghost',
}
export default function Button({
  href,
  variant = 'primary',
  className = '',
  children,
  disabled,
  ...props
}) {
  const classes = `button ${variants[variant] || variants.primary} ${className}`.trim()
  if (href && disabled)
    return (
      <span className={`${classes} opacity-50`} aria-disabled="true">
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
