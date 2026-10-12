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
  const heading = useRef(null)
  const titleId = useId()
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    const element = dialog.current
    const alreadyLocked = document.body.classList.contains('overflow-hidden')
    document.body.classList.add('overflow-hidden')
    element.showModal()
    if (element.scrollHeight > element.clientHeight) heading.current.focus()
    return () => {
      element.close()
      if (!alreadyLocked) document.body.classList.remove('overflow-hidden')
    }
  }, [isOpen])

  async function submit(event) {
    event.preventDefault()
    if (busy) return
    setBusy(true)
    try {
      await onConfirm()
    } finally {
      setBusy(false)
    }
  }

  return (
    <dialog
      ref={dialog}
      className="m-auto max-h-[calc(100dvh_-_44px)] w-[calc(100%_-_44px)] max-w-[440px] overflow-y-auto rounded-[18px] bg-white p-7 text-brand-ink shadow-[0_24px_80px_#0003] backdrop:bg-[#17111fa6] backdrop:backdrop-blur-[4px] max-[640px]:p-6"
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault()
        if (!busy) onClose()
      }}
    >
      <form onSubmit={submit}>
        <h2
          ref={heading}
          tabIndex={-1}
          className="mb-3 text-[22px] font-extrabold tracking-[-0.8px] outline-none"
          id={titleId}
        >
          {title}
        </h2>
        <p className="text-body leading-[1.7] text-brand-muted">{message}</p>
        {leading && (
          <Alert variant="info" className="mt-4 mb-0">
            {leading}
          </Alert>
        )}
        {children && <div className="mt-5">{children}</div>}
        <div className="mt-[25px] flex flex-wrap justify-end gap-[9px]">
          {option2 && (
            <Button variant="secondary" disabled={busy} onClick={onClose} autoFocus>
              {option2}
            </Button>
          )}
          <Button type="submit" variant={confirm ? 'primary' : 'danger'} disabled={busy}>
            {busy ? 'Aguarde…' : option1}
          </Button>
        </div>
      </form>
    </dialog>
  )
}
