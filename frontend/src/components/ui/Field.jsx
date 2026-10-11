export default function Field({
  label,
  error,
  hint,
  as = 'input',
  children,
  id,
  name,
  className = '',
  ...props
}) {
  const Control = as
  const inputId = id || name
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
  return (
    <div className={`field ${className}`}>
      {label && (
        <label htmlFor={inputId}>
          {label}
          {props.required && <span aria-hidden="true"> *</span>}
        </label>
      )}
      {as === 'input' ? (
        <input
          id={inputId}
          name={name}
          className="field-control"
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          {...props}
        />
      ) : (
        <Control
          id={inputId}
          name={name}
          className="field-control"
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          {...props}
        >
          {children}
        </Control>
      )}
      {hint && !error && (
        <p className="field-hint" id={`${inputId}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        <p className="field-error" id={`${inputId}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
