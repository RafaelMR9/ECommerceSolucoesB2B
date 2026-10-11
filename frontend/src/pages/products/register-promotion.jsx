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
  const [values, setValues] = useState({ startDate: '', endDate: '', salePrice: '' }),
    [errors, setErrors] = useState({}),
    [success, setSuccess] = useState(''),
    [busy, setBusy] = useState(false)
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
        title="Cadastrar promoção"
        description={`${product.name} · Preço atual: ${money(product.salePrice)}`}
        back={{ href: `/products/${product.id}`, label: product.name }}
      />
      <form className="form-panel" onSubmit={submit}>
        <Alert>{errors.detail || errors.non_field_errors}</Alert>
        <Alert variant="success">{success}</Alert>
        <div className="form-grid">
          {[
            ['startDate', 'Início da promoção'],
            ['endDate', 'Fim da promoção'],
          ].map(([name, label]) => (
            <Field
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
          name="salePrice"
          label="Preço promocional (R$)"
          type="number"
          min={0.01}
          step={0.01}
          value={values.salePrice}
          onChange={change}
          error={errors.salePrice}
          required
        />
        <div className="form-actions">
          <Button type="submit" disabled={busy}>
            {busy ? 'Salvando…' : 'Cadastrar promoção'}
          </Button>
          <Button href={`/products/${product.id}`} variant="secondary">
            Cancelar
          </Button>
        </div>
      </form>
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
