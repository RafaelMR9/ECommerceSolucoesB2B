import BaseLayout from '@/components/shared/BaseLayout'
import PartnerDetails from '@/components/partners/PartnerDetails'
import DataTable from '@/components/ui/DataTable'
import OrderStatus from '@/components/orders/OrderStatus'
import { date } from '@/lib/format'
import { withSession } from '@/lib/server/page'
export default function Carrier({ partner, shipments, orders }) {
  return (
    <BaseLayout>
      <PartnerDetails kind="carriers" partner={partner}>
        <h2 className="section-title mb-5">Entregas relacionadas</h2>
        <DataTable
          empty={!shipments.length}
          emptyMessage="Nenhuma entrega desta transportadora"
          label="Entregas da transportadora"
        >
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Enviado em</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map((shipment) => {
              const order = orders.find((o) => o.id === shipment.salesOrder)
              return (
                <tr key={shipment.id}>
                  <td>#{shipment.salesOrder}</td>
                  <td>{date(shipment.dateHour, true)}</td>
                  <td>{order ? <OrderStatus order={order} /> : 'Pedido indisponível'}</td>
                </tr>
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
