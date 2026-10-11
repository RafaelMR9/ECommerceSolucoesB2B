import { useState } from 'react'
import { useRouter } from 'next/router'
import Field from '@/components/ui/Field'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import { errorFields } from '@/lib/format'
import { validateCnpj, validateEmail } from '@/utils/utils'
import { registerSupplier, updateSupplier } from '@/services/supplierService'
import { registerCarrier, updateCarrier } from '@/services/carrierService'

const actions = {
  suppliers: { create: registerSupplier, update: updateSupplier },
  carriers: { create: registerCarrier, update: updateCarrier },
}
export default function PartnerForm({ kind, partner }) {
  const router = useRouter()
  const [values, setValues] = useState(partner || { name: '', cnpj: '', email: '' })
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const [success, setSuccess] = useState('')
  function change(e) {
    setValues((p) => ({ ...p, [e.target.name]: e.target.value }))
    setErrors((p) => ({ ...p, [e.target.name]: '' }))
  }
  async function submit(e) {
    e.preventDefault()
    if (busy) return
    const validation = {}
    if (!validateEmail(values.email)) validation.email = 'Informe um e-mail válido.'
    if (!validateCnpj(values.cnpj)) validation.cnpj = 'Use o formato 00.000.000/0000-00.'
    if (Object.keys(validation).length) {
      setErrors(validation)
      return
    }
    setBusy(true)
    setErrors({})
    setSuccess('')
    try {
      if (partner) {
        await actions[kind].update(values, partner.id)
        await router.push(`/${kind}/${partner.id}`)
      } else {
        await actions[kind].create(values)
        setSuccess('Cadastro realizado com sucesso.')
        setValues({ name: '', cnpj: '', email: '' })
      }
    } catch (error) {
      setErrors(errorFields(error))
    } finally {
      setBusy(false)
    }
  }
  return (
    <form className="form-panel" onSubmit={submit}>
      <Alert>{errors.detail}</Alert>
      <Alert variant="success">{success}</Alert>
      <Field
        name="name"
        label="Nome"
        value={values.name}
        onChange={change}
        error={errors.name}
        required
      />
      <Field
        name="cnpj"
        label="CNPJ"
        placeholder="00.000.000/0000-00"
        value={values.cnpj}
        onChange={change}
        error={errors.cnpj}
        required
      />
      <Field
        name="email"
        label="E-mail"
        type="email"
        value={values.email}
        onChange={change}
        error={errors.email}
        required
      />
      <div className="form-actions">
        <Button type="submit" disabled={busy}>
          {busy ? 'Salvando…' : partner ? 'Salvar alterações' : 'Cadastrar'}
        </Button>
        <Button href={partner ? `/${kind}/${partner.id}` : `/${kind}`} variant="secondary">
          Cancelar
        </Button>
      </div>
    </form>
  )
}
