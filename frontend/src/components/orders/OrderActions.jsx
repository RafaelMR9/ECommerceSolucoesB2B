import Button from '@/components/ui/Button'
import StatusBadge from '@/components/ui/StatusBadge'
export default function OrderActions({ order, payments, supplier, admin, onAction }) {
  if (payments && order.paid === false)
    return (
      <Button size="small" onClick={() => onAction(order, 'paid', 'Regularizar Pagamento')}>
        Marcar como Pago
      </Button>
    )
  if (payments) {
    if (order.paid !== null)
      return (
        <StatusBadge variant={order.paid ? 'success' : 'danger'}>
          {order.paid ? 'Pago' : 'Não pago'}
        </StatusBadge>
      )
    return (
      <>
        <Button size="small" onClick={() => onAction(order, 'paid', 'Registrar Pagamento')}>
          Marcar como Pago
        </Button>
        <Button
          size="small"
          variant="danger"
          onClick={() => onAction(order, 'unpaid', 'Registrar Pendência')}
        >
          Não Pago
        </Button>
      </>
    )
  }
  if (supplier) {
    if (order.recieved !== null) return null
    return (
      <>
        <Button size="small" onClick={() => onAction(order, 'receive', 'Confirmar Recebimento')}>
          Recebido
        </Button>
        <Button
          size="small"
          variant="danger"
          onClick={() => onAction(order, 'unreceived', 'Confirmar Não Recebimento')}
        >
          Não Recebido
        </Button>
      </>
    )
  }
  if (order.cancelled === false)
    return (
      <>
        {admin && (
          <Button size="small" onClick={() => onAction(order, 'prepare', 'Preparar Pedido')}>
            Preparar Envio
          </Button>
        )}
        <Button
          size="small"
          variant="danger"
          onClick={() => onAction(order, 'cancel', 'Cancelar Pedido')}
        >
          Cancelar
        </Button>
      </>
    )
  if (admin && order.cancelled === null && !order.sending)
    return (
      <Button size="small" onClick={() => onAction(order, 'send', 'Enviar Pedido')}>
        Marcar como Enviado
      </Button>
    )
  if (admin && order.sending && !order.recieved && order.cancelled !== true)
    return (
      <Button size="small" onClick={() => onAction(order, 'receive', 'Confirmar Recebimento')}>
        Marcar como Recebido
      </Button>
    )
  return null
}
