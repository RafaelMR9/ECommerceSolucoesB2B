import { TableHeader, TableRow, TableCell } from '@/components/ui/DataTable'
import BaseLayout from '@/components/shared/BaseLayout'
import PartnerDetails from '@/components/partners/PartnerDetails'
import DataTable from '@/components/ui/DataTable'
import { money, activePromotion } from '@/lib/format'
import { withSession } from '@/lib/server/page'
export default function Supplier({ partner, products, promotions, now }) {
  return (
    <BaseLayout>
      <PartnerDetails kind="suppliers" partner={partner}>
        <h2 className="text-[23px] font-extrabold tracking-[-0.8px] mb-5">Produtos Relacionados</h2>
        <DataTable
          empty={!products.length}
          emptyMessage="Nenhum produto deste fornecedor"
          label="Produtos do Fornecedor"
        >
          <thead className="bg-[#3c2456]">
            <tr>
              <TableHeader>Produto</TableHeader>
              <TableHeader>Preço de Venda</TableHeader>
              <TableHeader>Em Estoque</TableHeader>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>
                  {money(activePromotion(product, promotions, now)?.salePrice ?? product.salePrice)}
                </TableCell>
                <TableCell>{product.currentStockQuantity}</TableCell>
              </TableRow>
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
