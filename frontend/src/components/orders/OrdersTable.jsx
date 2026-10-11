import { useState } from 'react'
import { useRouter } from 'next/router'
import DataTable from '@/components/ui/DataTable'
import Field from '@/components/ui/Field'
import Alert from '@/components/ui/Alert'
import Modal from '@/components/shared/Modal'
import OrderStatus from './OrderStatus'
import OrderActions from './OrderActions'
import StatusBadge from '@/components/ui/StatusBadge'
import { money, date, errorFields } from '@/lib/format'
import {
  cancelOrder,
  prepareOrder,
  sendOrder,
  receiveOrder,
  recordPayment,
} from '@/services/orderOperations'

function nextDelivery(order) {
  if (!order.deliveryDate) return '—'
  const next = new Date(`${order.deliveryDate}T12:00:00Z`)
  next.setUTCDate(next.getUTCDate() + order.deliveryFrequency)
  return date(next)
}
export default function OrdersTable({
  orders,
  companies = [],
  carriers = [],
  supplier = false,
  admin = false,
  recurring = false,
  payments = false,
}) {
  const router = useRouter()
  const [action, setAction] = useState(null),
    [carrier, setCarrier] = useState(''),
    [error, setError] = useState('')
  function ask(order, kind, label) {
    setAction({ order, kind, label })
    setCarrier('')
    setError('')
  }
  async function confirm() {
    try {
      const { order, kind } = action
      if (kind === 'cancel') await cancelOrder(order)
      if (kind === 'prepare') await prepareOrder(order)
      if (kind === 'send') await sendOrder(order, carrier)
      if (kind === 'receive') await receiveOrder(order, supplier, true)
      if (kind === 'unreceived') await receiveOrder(order, true, false)
      if (kind === 'paid') await recordPayment(order, true)
      if (kind === 'unpaid') await recordPayment(order, false)
      setAction(null)
      await router.replace(router.asPath)
    } catch (e) {
      setError(Object.values(errorFields(e)).join(' '))
    }
  }

  return (
    <>
      <DataTable
        empty={!orders.length}
        emptyMessage={
          payments ? 'Nenhum pagamento nesta categoria' : 'Nenhum pedido nesta categoria'
        }
        label={payments ? 'Pagamentos' : 'Pedidos'}
      >
        <thead>
          <tr>
            <th>Pedido</th>
            {(admin || supplier) && <th>{supplier ? 'Fornecedor' : 'Organização'}</th>}
            <th>Realizado em</th>
            <th>Valor</th>
            {recurring ? (
              <>
                <th>Recorrência</th>
                <th>Próxima Entrega</th>
                <th>Última Entrega</th>
              </>
            ) : (
              <>
                <th>Faturado</th>
                <th>Entrega</th>
              </>
            )}
            <th>{payments ? 'Pagamento' : 'Status'}</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const company = companies.find((c) => c.id === (supplier ? order.supplier : order.user))
            return (
              <tr key={order.id}>
                <td>
                  <strong>#{order.id}</strong>
                </td>
                {(admin || supplier) && (
                  <td>
                    <p>{company?.name || company?.username || 'Cadastro indisponível'}</p>
                    {company?.cnpj && <p className="text-sm text-gray-500 mt-1">{company.cnpj}</p>}
                  </td>
                )}
                <td>{date(order.orderDate, true)}</td>
                <td className="whitespace-nowrap font-semibold">
                  {money(supplier ? order.totalCostValue : order.totalSaleValue)}
                </td>
                {recurring ? (
                  <>
                    <td>A cada {order.deliveryFrequency} dias</td>
                    <td>{nextDelivery(order)}</td>
                    <td>{date(order.deliveryDate)}</td>
                  </>
                ) : (
                  <>
                    <td>{order.faturedPayment ? 'Sim' : 'Não'}</td>
                    <td>{date(order.deliveryDate)}</td>
                  </>
                )}
                <td>
                  {payments ? (
                    <StatusBadge
                      variant={
                        order.paid === true ? 'success' : order.paid === false ? 'danger' : 'accent'
                      }
                    >
                      {order.paid === true
                        ? 'Pago'
                        : order.paid === false
                          ? 'Não pago'
                          : 'Aguardando pagamento'}
                    </StatusBadge>
                  ) : (
                    <OrderStatus order={order} supplier={supplier} />
                  )}
                </td>
                <td>
                  <div className="table-actions">
                    <OrderActions
                      order={order}
                      payments={payments}
                      supplier={supplier}
                      admin={admin}
                      onAction={ask}
                    />
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </DataTable>
      <Modal
        isOpen={Boolean(action)}
        title={action?.label}
        message={`Confirma esta ação para o pedido #${action?.order.id}?`}
        confirm={
          action?.kind !== 'cancel' && action?.kind !== 'unpaid' && action?.kind !== 'unreceived'
        }
        option1="Confirmar"
        option2="Voltar"
        onClose={() => setAction(null)}
        onConfirm={confirm}
      >
        <Alert>{error}</Alert>
        {action?.kind === 'send' && (
          <Field
            as="select"
            name="carrier"
            label="Transportadora"
            value={carrier}
            onChange={(e) => setCarrier(e.target.value)}
            required
          >
            <option value="">Selecione a transportadora</option>
            {carriers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Field>
        )}
      </Modal>
    </>
  )
}
