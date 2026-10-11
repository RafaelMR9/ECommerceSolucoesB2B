import Button from '@/components/ui/Button'
import StatusBadge from '@/components/ui/StatusBadge'
export default function OrderActions({ order, payments, supplier, admin, onAction }) {
  if (payments && order.paid === false)
    return (
      <Button
        className="button-small"
        onClick={() => onAction(order, 'paid', 'Regularizar pagamento')}
      >
        Marcar como pago
      </Button>
    )
  if (payments)
    return order.paid === null ? (
      <>
        <Button
          className="button-small"
          onClick={() => onAction(order, 'paid', 'Registrar pagamento')}
        >
          Marcar como pago
        </Button>
        <Button
          variant="danger"
          className="button-small"
          onClick={() => onAction(order, 'unpaid', 'Registrar pendência')}
        >
          Não pago
        </Button>
      </>
    ) : (
      <StatusBadge variant={order.paid ? 'success' : 'danger'}>
        {order.paid ? 'Pago' : 'Não pago'}
      </StatusBadge>
    )
  if (supplier)
    return order.recieved === null ? (
      <>
        <Button
          className="button-small"
          onClick={() => onAction(order, 'receive', 'Confirmar recebimento')}
        >
          Recebido
        </Button>
        <Button
          variant="danger"
          className="button-small"
          onClick={() => onAction(order, 'unreceived', 'Confirmar não recebimento')}
        >
          Não recebido
        </Button>
      </>
    ) : null
  if (order.cancelled === false)
    return (
      <>
        {admin && (
          <Button
            className="button-small"
            onClick={() => onAction(order, 'prepare', 'Preparar pedido')}
          >
            Preparar envio
          </Button>
        )}
        <Button
          variant="danger"
          className="button-small"
          onClick={() => onAction(order, 'cancel', 'Cancelar pedido')}
        >
          Cancelar
        </Button>
      </>
    )
  if (admin && order.cancelled === null && !order.sending)
    return (
      <Button className="button-small" onClick={() => onAction(order, 'send', 'Enviar pedido')}>
        Marcar como enviado
      </Button>
    )
  if (admin && order.sending && !order.recieved && order.cancelled !== true)
    return (
      <Button
        className="button-small"
        onClick={() => onAction(order, 'receive', 'Confirmar recebimento')}
      >
        Marcar como recebido
      </Button>
    )
  return null
}
