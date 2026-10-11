import { useEffect, useId, useRef, useState } from 'react'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'

export default function Modal({
  isOpen,
  title,
  message,
  leading,
  confirm,
  option1,
  option2,
  onConfirm,
  onClose,
  children,
}) {
  const dialog = useRef(null)
  const titleId = useId()
  const [busy, setBusy] = useState(false)
  const handlers = useRef({ busy, onClose })
  useEffect(() => {
    handlers.current = { busy, onClose }
  }, [busy, onClose])
  useEffect(() => {
    if (!isOpen) return
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.current?.querySelector('button')?.focus()
    function handleKey(event) {
      if (event.key === 'Escape' && !handlers.current.busy) handlers.current.onClose?.()
      if (event.key === 'Tab') {
        const buttons = dialog.current?.querySelectorAll(
          'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href]'
        )
        if (!buttons?.length) {
          event.preventDefault()
          return
        }
        const first = buttons[0],
          last = buttons[buttons.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKey)
      previousFocus?.focus()
    }
  }, [isOpen])
  if (!isOpen) return null
  async function confirmAction() {
    setBusy(true)
    try {
      await onConfirm()
    } finally {
      setBusy(false)
    }
  }
  return (
    <div className="modal-overlay">
      <section
        ref={dialog}
        className="modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <h2 id={titleId}>{title}</h2>
        <p>{message}</p>
        {leading && (
          <div className="mt-4">
            <Alert variant="info">{leading}</Alert>
          </div>
        )}
        {children && <div className="mt-5">{children}</div>}
        <div className="modal-actions">
          {option2 && (
            <Button variant="secondary" disabled={busy} onClick={onClose}>
              {option2}
            </Button>
          )}
          <Button variant={confirm ? 'primary' : 'danger'} disabled={busy} onClick={confirmAction}>
            {busy ? 'Aguarde…' : option1}
          </Button>
        </div>
      </section>
    </div>
  )
}
