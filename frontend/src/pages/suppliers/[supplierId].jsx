import BaseLayout from '@/components/shared/BaseLayout'
import PartnerDetails from '@/components/partners/PartnerDetails'
import DataTable from '@/components/ui/DataTable'
import { money, activePromotion } from '@/lib/format'
import { withSession } from '@/lib/server/page'
export default function Supplier({ partner, products, promotions, now }) {
  return (
    <BaseLayout>
      <PartnerDetails kind="suppliers" partner={partner}>
        <h2 className="section-title mb-5">Produtos Relacionados</h2>
        <DataTable
          empty={!products.length}
          emptyMessage="Nenhum produto deste fornecedor"
          label="Produtos do Fornecedor"
        >
          <thead>
            <tr>
              <th>Produto</th>
              <th>Preço de Venda</th>
              <th>Em Estoque</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>
                  {money(activePromotion(product, promotions, now)?.salePrice ?? product.salePrice)}
                </td>
                <td>{product.currentStockQuantity}</td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </PartnerDetails>
    </BaseLayout>
  )
}
export const getServerSideProps = withSession(
  async ({ api, params }) => {
    if (!/^\d+$/.test(params.supplierId)) return { notFound: true }
    const [partner, allProducts, promotions] = await Promise.all([
      api(`suppliers/${params.supplierId}/detail/`),
      api('products/'),
      api('marketing/'),
    ])
    return {
      partner,
      products: allProducts.filter((p) => p.supplier === partner.id),
      promotions,
      now: Date.now(),
    }
  },
  { admin: true }
)
