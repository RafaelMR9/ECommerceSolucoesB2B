import Button from '@/components/ui/Button'
import StatusBadge from '@/components/ui/StatusBadge'
export default function OrderActions({ order, payments, supplier, admin, onAction }) {
  if (payments && order.paid === false)
    return (
      <Button
        className="button-small"
        onClick={() => onAction(order, 'paid', 'Regularizar Pagamento')}
      >
        Marcar como Pago
      </Button>
    )
  if (payments)
    return order.paid === null ? (
      <>
        <Button
          className="button-small"
          onClick={() => onAction(order, 'paid', 'Registrar Pagamento')}
        >
          Marcar como Pago
        </Button>
        <Button
          variant="danger"
          className="button-small"
          onClick={() => onAction(order, 'unpaid', 'Registrar Pendência')}
        >
          Não Pago
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
          onClick={() => onAction(order, 'receive', 'Confirmar Recebimento')}
        >
          Recebido
        </Button>
        <Button
          variant="danger"
          className="button-small"
          onClick={() => onAction(order, 'unreceived', 'Confirmar Não Recebimento')}
        >
          Não Recebido
        </Button>
      </>
    ) : null
  if (order.cancelled === false)
    return (
      <>
        {admin && (
          <Button
            className="button-small"
            onClick={() => onAction(order, 'prepare', 'Preparar Pedido')}
          >
            Preparar Envio
          </Button>
        )}
        <Button
          variant="danger"
          className="button-small"
          onClick={() => onAction(order, 'cancel', 'Cancelar Pedido')}
        >
          Cancelar
        </Button>
      </>
    )
  if (admin && order.cancelled === null && !order.sending)
    return (
      <Button className="button-small" onClick={() => onAction(order, 'send', 'Enviar Pedido')}>
        Marcar como Enviado
      </Button>
    )
  if (admin && order.sending && !order.recieved && order.cancelled !== true)
    return (
      <Button
        className="button-small"
        onClick={() => onAction(order, 'receive', 'Confirmar Recebimento')}
      >
        Marcar como Recebido
      </Button>
    )
  return null
}
