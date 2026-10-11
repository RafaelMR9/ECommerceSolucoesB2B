import StatusBadge from '@/components/ui/StatusBadge'
export default function OrderStatus({ order, supplier = false }) {
  if (supplier)
    return (
      <StatusBadge
        variant={
          order.recieved === true ? 'success' : order.recieved === false ? 'danger' : 'accent'
        }
      >
        {order.recieved === true
          ? 'Recebido'
          : order.recieved === false
            ? 'Não recebido'
            : 'Aguardando recebimento'}
      </StatusBadge>
    )
  if (order.cancelled === true) return <StatusBadge variant="danger">Cancelado</StatusBadge>
  if (order.recieved) return <StatusBadge variant="success">Recebido</StatusBadge>
  if (order.sending) return <StatusBadge variant="accent">Em transporte</StatusBadge>
  return (
    <StatusBadge variant="accent">
      {order.cancelled === null ? 'Preparando envio' : 'Aguardando preparo'}
    </StatusBadge>
  )
}
