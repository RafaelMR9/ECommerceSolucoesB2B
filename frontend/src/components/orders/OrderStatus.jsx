import StatusBadge from '@/components/ui/StatusBadge'

export function PaymentStatus({ paid }) {
  if (paid === true) return <StatusBadge variant="success">Pago</StatusBadge>
  if (paid === false) return <StatusBadge variant="danger">Não pago</StatusBadge>
  return <StatusBadge variant="accent">Aguardando pagamento</StatusBadge>
}

export default function OrderStatus({ order, supplier = false }) {
  if (supplier) {
    if (order.recieved === true) return <StatusBadge variant="success">Recebido</StatusBadge>
    if (order.recieved === false) return <StatusBadge variant="danger">Não recebido</StatusBadge>
    return <StatusBadge variant="accent">Aguardando recebimento</StatusBadge>
  }
  if (order.cancelled === true) return <StatusBadge variant="danger">Cancelado</StatusBadge>
  if (order.recieved) return <StatusBadge variant="success">Recebido</StatusBadge>
  if (order.sending) return <StatusBadge variant="accent">Em transporte</StatusBadge>
  return (
    <StatusBadge variant="accent">
      {order.cancelled === null ? 'Preparando envio' : 'Aguardando preparo'}
    </StatusBadge>
  )
}
