import { cn } from '@/lib/classes'
import Input from './Input'

export default function Field({
  label,
  error,
  hint,
  as = 'input',
  children,
  id,
  name,
  className = '',
  tone = 'plain',
  ...props
}) {
  const inputId = id || name
  const describedBy = error ? inputId + '-error' : hint ? inputId + '-hint' : undefined
  return (
    <div className={cn('mb-5.25 min-w-0', className)}>
      {label && (
        <label className="mb-2 block text-ui font-semibold text-brand-ink" htmlFor={inputId}>
          {label}
          {props.required && (
            <span className="text-brand-accent" aria-hidden="true">
              {' '}
              *
            </span>
          )}
        </label>
      )}
      <Input
        as={as}
        tone={tone}
        id={inputId}
        name={name}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        {...props}
      >
        {children}
      </Input>
      {hint && !error && (
        <p className="mt-1.75 text-small text-brand-muted" id={inputId + '-hint'}>
          {hint}
        </p>
      )}
      {error && (
        <p
          className="mt-1.75 whitespace-pre-line text-small text-brand-danger"
          id={inputId + '-error'}
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  )
}
