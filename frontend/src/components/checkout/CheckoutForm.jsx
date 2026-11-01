import FormActions from '@/components/ui/FormActions'
import FormPanel from '@/components/ui/FormPanel'
import { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { AuthContext } from '@/contexts/authContext'
import Field from '@/components/ui/Field'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import { errorFields } from '@/lib/format'
import { checkout } from '@/services/checkoutService'

export default function CheckoutForm() {
  const { user } = useContext(AuthContext)
  const router = useRouter()
  const [future, setFuture] = useState(false)
  const [values, setValues] = useState({
    deliveryDate: '',
    deliveryFrequency: '',
    faturedPayment: false,
  })
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  function change(e) {
    const { name, value, type, checked } = e.target
    setValues((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
    setErrors((p) => ({ ...p, [name]: '' }))
  }
  async function submit(e) {
    e.preventDefault()
    if (busy) return
    setErrors({})
    setBusy(true)
    try {
      const result = await checkout({
        deliveryDate: future ? values.deliveryDate : null,
        deliveryFrequency:
          future && values.deliveryFrequency ? Number(values.deliveryFrequency) : null,
        faturedPayment: values.faturedPayment,
      })
      await router.push(result.next)
    } catch (error) {
      setErrors(errorFields(error))
    } finally {
      setBusy(false)
    }
  }
  return (
    <FormPanel onSubmit={submit}>
      <Alert>{errors.detail || errors.non_field_errors}</Alert>
      <h2 className="text-[23px] font-extrabold tracking-[-0.8px] mb-5">Entrega e Pagamento</h2>
      <div className="flex gap-2.5 items-start mt-3.75 mr-0 mb-5.5 ml-0">
        <input
          className="accent-brand-accent w-4.5 h-4.5 mt-0.75"
          id="futureDelivery"
          type="checkbox"
          checked={future}
          onChange={(e) => setFuture(e.target.checked)}
        />
        <label className="text-ui text-brand-ink" htmlFor="futureDelivery">
          Agendar uma entrega futura
        </label>
      </div>
      {future && (
        <>
          <Field
            tone="tinted"
            name="deliveryDate"
            label="Primeira Entrega"
            type="date"
            value={values.deliveryDate}
            onChange={change}
            error={errors.deliveryDate}
            required
          />
          <Field
            tone="tinted"
            name="deliveryFrequency"
            label="Repetir a Cada Quantos Dias?"
            type="number"
            min={10}
            step={1}
            value={values.deliveryFrequency}
            onChange={change}
            error={errors.deliveryFrequency}
            hint="Opcional. Informe pelo menos 10 dias para criar um pedido recorrente."
          />
        </>
      )}
      <div className="flex gap-2.5 items-start mt-3.75 mr-0 mb-5.5 ml-0">
        <input
          className="accent-brand-accent w-4.5 h-4.5 mt-0.75"
          id="faturedPayment"
          name="faturedPayment"
          type="checkbox"
          checked={values.faturedPayment}
          onChange={change}
          disabled={!user.authorizeFature}
        />
        <label className="text-ui text-brand-ink" htmlFor="faturedPayment">
          Pagamento faturado
          <small className="block text-sm text-brand-muted mt-1">
            {user.authorizeFature
              ? 'Pagamento em até 30 dias após a compra.'
              : 'Sua organização ainda não possui autorização para compras faturadas.'}
          </small>
        </label>
      </div>
      <Alert>{errors.faturedPayment}</Alert>
      {!values.faturedPayment && (
        <p className="text-sm text-brand-muted mb-6">
          O pagamento será realizado no recebimento dos produtos.
        </p>
      )}
      <FormActions>
        <Button type="submit" loading={busy}>
          Finalizar Compra
        </Button>
        <Button href="/cart" variant="secondary" disabled={busy}>
          Voltar ao Carrinho
        </Button>
      </FormActions>
    </FormPanel>
  )
}
