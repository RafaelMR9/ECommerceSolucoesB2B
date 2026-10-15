import FormActions from '@/components/ui/FormActions'
import FormPanel from '@/components/ui/FormPanel'
import { useState } from 'react'
import { Building2, Truck } from 'lucide-react'
import FormLayout from '@/components/ui/FormLayout'
import FormSection from '@/components/ui/FormSection'
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
    <FormLayout
      icon={kind === 'suppliers' ? Building2 : Truck}
      title={kind === 'suppliers' ? 'Sua Rede de Fornecedores' : 'Sua Rede de Entregas'}
      description="Mantenha a identificação e o contato dos seus parceiros em um só lugar."
      points={[
        { title: 'Identificação', text: 'Use o nome e o CNPJ do parceiro.' },
        { title: 'Contato', text: 'Informe o e-mail utilizado pela empresa.' },
        { title: 'Organização', text: 'Consulte o parceiro e seus pedidos na plataforma.' },
      ]}
    >
      <FormPanel wide onSubmit={submit}>
        <Alert>{errors.detail}</Alert>
        <Alert variant="success">{success}</Alert>
        <FormSection
          icon={kind === 'suppliers' ? Building2 : Truck}
          title={kind === 'suppliers' ? 'Dados do Fornecedor' : 'Dados da Transportadora'}
          description="Preencha os campos obrigatórios indicados por *."
        >
          <div className="grid grid-cols-2 gap-y-0 gap-x-5.5 max-[640px]:grid-cols-1">
            <div className="col-span-full">
              <Field
                tone="tinted"
                name="name"
                label="Nome"
                value={values.name}
                onChange={change}
                error={errors.name}
                required
              />
            </div>
            <Field
              tone="tinted"
              name="cnpj"
              label="CNPJ"
              placeholder="00.000.000/0000-00"
              value={values.cnpj}
              onChange={change}
              error={errors.cnpj}
              required
            />
            <Field
              tone="tinted"
              name="email"
              label="E-mail"
              type="email"
              value={values.email}
              onChange={change}
              error={errors.email}
              required
            />
          </div>
        </FormSection>
        <FormActions>
          <Button type="submit" disabled={busy}>
            {busy ? 'Salvando…' : partner ? 'Salvar Alterações' : 'Cadastrar'}
          </Button>
          <Button href={partner ? `/${kind}/${partner.id}` : `/${kind}`} variant="secondary">
            Cancelar
          </Button>
        </FormActions>
      </FormPanel>
    </FormLayout>
  )
}
