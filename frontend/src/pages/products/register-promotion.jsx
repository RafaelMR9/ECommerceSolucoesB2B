import FormActions from '@/components/ui/FormActions'
import FormPanel from '@/components/ui/FormPanel'
import { Tag } from 'lucide-react'
import FormLayout from '@/components/ui/FormLayout'
import FormSection from '@/components/ui/FormSection'
import { useState } from 'react'
import BaseLayout from '@/components/shared/BaseLayout'
import PageHeader from '@/components/ui/PageHeader'
import Field from '@/components/ui/Field'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import { registerPromotion } from '@/services/marketingService'
import { errorFields, money } from '@/lib/format'
import { withSession } from '@/lib/server/page'
export default function RegisterPromotion({ product }) {
  const [values, setValues] = useState({ startDate: '', endDate: '', salePrice: '' })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState('')
  const [busy, setBusy] = useState(false)
  function change(e) {
    setValues((p) => ({ ...p, [e.target.name]: e.target.value }))
    setErrors({})
  }
  async function submit(e) {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setErrors({})
    setSuccess('')
    try {
      await registerPromotion({
        ...values,
        startDate: new Date(values.startDate).toISOString(),
        endDate: new Date(values.endDate).toISOString(),
        product: product.id,
      })
      setSuccess('Promoção cadastrada com sucesso.')
      setValues({ startDate: '', endDate: '', salePrice: '' })
    } catch (error) {
      setErrors(errorFields(error))
    } finally {
      setBusy(false)
    }
  }
  return (
    <BaseLayout>
      <PageHeader
        title="Cadastrar Promoção"
        description={`${product.name} · Preço atual: ${money(product.salePrice)}`}
        back={{ href: `/products/${product.id}`, label: product.name }}
      />
      <FormLayout
        icon={Tag}
        title="Uma Oferta Bem Definida"
        description="Configure o preço promocional deste produto durante o período escolhido."
        points={[
          { title: 'Período', text: 'Informe o início e o término da promoção.' },
          { title: 'Preço', text: 'Escolha o valor promocional por embalagem.' },
          { title: 'Catálogo', text: 'O desconto aparece durante o período de vigência.' },
        ]}
      >
        <FormPanel wide onSubmit={submit}>
          <FormSection
            icon={Tag}
            title="Condições da Promoção"
            description="Defina o período e o preço por embalagem."
          >
            <Alert>{errors.detail || errors.non_field_errors}</Alert>
            <Alert variant="success">{success}</Alert>
            <div className="grid grid-cols-2 gap-y-0 gap-x-5.5 max-[640px]:grid-cols-1">
              {[
                ['startDate', 'Início da promoção'],
                ['endDate', 'Fim da promoção'],
              ].map(([name, label]) => (
                <Field
                  tone="tinted"
                  key={name}
                  name={name}
                  label={label}
                  type="datetime-local"
                  value={values[name]}
                  onChange={change}
                  error={errors[name]}
                  required
                />
              ))}
            </div>
            <Field
              tone="tinted"
              name="salePrice"
              label="Preço Promocional (R$)"
              type="number"
              min={0.01}
              step={0.01}
              value={values.salePrice}
              onChange={change}
              error={errors.salePrice}
              required
            />
          </FormSection>
          <FormActions>
            <Button type="submit" loading={busy}>
              Cadastrar Promoção
            </Button>
            <Button href={`/products/${product.id}`} variant="secondary" disabled={busy}>
              Cancelar
            </Button>
          </FormActions>
        </FormPanel>
      </FormLayout>
    </BaseLayout>
  )
}
export const getServerSideProps = withSession(
  async ({ api, query }) => {
    if (!/^\d+$/.test(query.productId || '')) return { notFound: true }
    return { product: await api(`products/${query.productId}/detail/`) }
  },
  { admin: true }
)
