import { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { AuthContext } from '@/contexts/authContext'
import Field from '@/components/ui/Field'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import { errorFields } from '@/lib/format'
import { checkout } from '@/services/checkoutService'

export default function CheckoutForm() {
  const { user } = useContext(AuthContext),
    router = useRouter()
  const [future, setFuture] = useState(false),
    [values, setValues] = useState({
      deliveryDate: '',
      deliveryFrequency: '',
      faturedPayment: false,
    }),
    [errors, setErrors] = useState({}),
    [busy, setBusy] = useState(false)
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
    <form className="form-panel" onSubmit={submit}>
      <Alert>{errors.detail || errors.non_field_errors}</Alert>
      <h2 className="section-title mb-5">Entrega e pagamento</h2>
      <div className="check-field">
        <input
          id="futureDelivery"
          type="checkbox"
          checked={future}
          onChange={(e) => setFuture(e.target.checked)}
        />
        <label htmlFor="futureDelivery">Agendar uma entrega futura</label>
      </div>
      {future && (
        <>
          <Field
            name="deliveryDate"
            label="Primeira entrega"
            type="date"
            value={values.deliveryDate}
            onChange={change}
            error={errors.deliveryDate}
            required
          />
          <Field
            name="deliveryFrequency"
            label="Repetir a cada quantos dias?"
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
      <div className="check-field">
        <input
          id="faturedPayment"
          name="faturedPayment"
          type="checkbox"
          checked={values.faturedPayment}
          onChange={change}
          disabled={!user.authorizeFature}
        />
        <label htmlFor="faturedPayment">
          Pagamento faturado
          <small className="block text-xs text-gray-500 mt-1">
            {user.authorizeFature
              ? 'Pagamento em até 30 dias após a compra.'
              : 'Sua organização ainda não possui autorização para compras faturadas.'}
          </small>
        </label>
      </div>
      <Alert>{errors.faturedPayment}</Alert>
      {!values.faturedPayment && (
        <p className="text-sm text-gray-500 mb-6">
          O pagamento será realizado no recebimento dos produtos.
        </p>
      )}
      <div className="form-actions">
        <Button type="submit" disabled={busy}>
          {busy ? 'Finalizando…' : 'Finalizar compra'}
        </Button>
        <Button href="/cart" variant="secondary">
          Voltar ao carrinho
        </Button>
      </div>
    </form>
  )
}
