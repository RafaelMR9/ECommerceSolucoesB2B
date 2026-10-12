import BaseLayout from '@/components/shared/BaseLayout'
import PartnerDetails from '@/components/partners/PartnerDetails'
import DataTable, { TableHeader, TableRow, TableCell } from '@/components/ui/DataTable'
import OrderStatus from '@/components/orders/OrderStatus'
import { date } from '@/lib/format'
import { withSession } from '@/lib/server/page'
export default function Carrier({ partner, shipments, orders }) {
  const ordersById = new Map(orders.map((order) => [order.id, order]))
  return (
    <BaseLayout>
      <PartnerDetails kind="carriers" partner={partner}>
        <h2 className="text-[23px] font-extrabold tracking-[-0.8px] mb-5">Entregas Relacionadas</h2>
        <DataTable
          empty={!shipments.length}
          emptyMessage="Nenhuma entrega desta transportadora"
          label="Entregas da Transportadora"
        >
          <thead className="bg-[#3c2456]">
            <tr>
              <TableHeader>Pedido</TableHeader>
              <TableHeader>Enviado em</TableHeader>
              <TableHeader>Status</TableHeader>
            </tr>
          </thead>
          <tbody>
            {shipments.map((shipment) => {
              const order = ordersById.get(shipment.salesOrder)
              return (
                <TableRow key={shipment.id}>
                  <TableCell>#{shipment.salesOrder}</TableCell>
                  <TableCell>{date(shipment.dateHour, true)}</TableCell>
                  <TableCell>
                    {order ? <OrderStatus order={order} /> : 'Pedido indisponível'}
                  </TableCell>
                </TableRow>
              )
            })}
          </tbody>
        </DataTable>
      </PartnerDetails>
    </BaseLayout>
  )
}
export const getServerSideProps = withSession(
  async ({ api, params }) => {
    if (!/^\d+$/.test(params.carrierId)) return { notFound: true }
    const [partner, shipments, orders] = await Promise.all([
      api(`carriers/${params.carrierId}/detail/`),
      api(`carriers/salesShipment/filter/?fetchCarrier=${params.carrierId}`),
      api('orders/salesOrder/'),
    ])
    return { partner, shipments, orders }
  },
  { admin: true }
)
