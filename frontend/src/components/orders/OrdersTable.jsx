import { useState } from 'react'
import { useRouter } from 'next/router'
import DataTable, { TableHeader, TableRow, TableCell } from '@/components/ui/DataTable'
import Field from '@/components/ui/Field'
import Alert from '@/components/ui/Alert'
import Modal from '@/components/shared/Modal'
import OrderStatus, { PaymentStatus } from './OrderStatus'
import OrderActions from './OrderActions'
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
  const companiesById = new Map(companies.map((company) => [company.id, company]))
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
        <thead className="bg-[#3c2456]">
          <tr>
            <TableHeader>Pedido</TableHeader>
            {(admin || supplier) && (
              <TableHeader>{supplier ? 'Fornecedor' : 'Organização'}</TableHeader>
            )}
            <TableHeader>Realizado em</TableHeader>
            <TableHeader>Valor</TableHeader>
            {recurring ? (
              <>
                <TableHeader>Recorrência</TableHeader>
                <TableHeader>Próxima Entrega</TableHeader>
                <TableHeader>Última Entrega</TableHeader>
              </>
            ) : (
              <>
                <TableHeader>Faturado</TableHeader>
                <TableHeader>Entrega</TableHeader>
              </>
            )}
            <TableHeader>{payments ? 'Pagamento' : 'Status'}</TableHeader>
            <TableHeader>Ações</TableHeader>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const company = companiesById.get(supplier ? order.supplier : order.user)
            return (
              <TableRow key={order.id}>
                <TableCell>
                  <strong>#{order.id}</strong>
                </TableCell>
                {(admin || supplier) && (
                  <TableCell className="min-w-47.5">
                    <p className="m-0">
                      {company?.name || company?.username || 'Cadastro indisponível'}
                    </p>
                    {company?.cnpj && (
                      <p className="mt-1 whitespace-nowrap text-small text-brand-muted">
                        {company.cnpj}
                      </p>
                    )}
                  </TableCell>
                )}
                <TableCell className="whitespace-nowrap">{date(order.orderDate, true)}</TableCell>
                <TableCell className="whitespace-nowrap font-semibold">
                  {money(supplier ? order.totalCostValue : order.totalSaleValue)}
                </TableCell>
                {recurring ? (
                  <>
                    <TableCell>A cada {order.deliveryFrequency} dias</TableCell>
                    <TableCell>{nextDelivery(order)}</TableCell>
                    <TableCell>{date(order.deliveryDate)}</TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{order.faturedPayment ? 'Sim' : 'Não'}</TableCell>
                    <TableCell>{date(order.deliveryDate)}</TableCell>
                  </>
                )}
                <TableCell>
                  {payments ? (
                    <PaymentStatus paid={order.paid} />
                  ) : (
                    <OrderStatus order={order} supplier={supplier} />
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1.75 flex-wrap min-w-40">
                    <OrderActions
                      order={order}
                      payments={payments}
                      supplier={supplier}
                      admin={admin}
                      onAction={ask}
                    />
                  </div>
                </TableCell>
              </TableRow>
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
