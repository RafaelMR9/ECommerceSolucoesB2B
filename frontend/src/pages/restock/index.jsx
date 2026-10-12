import BaseLayout from '@/components/shared/BaseLayout'
import PageHeader from '@/components/ui/PageHeader'
import DataTable, { TableHeader, TableRow, TableCell } from '@/components/ui/DataTable'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import EmptyState from '@/components/ui/EmptyState'
import { money } from '@/lib/format'
import { withSession } from '@/lib/server/page'
export default function Restock({ products, suppliers, order }) {
  return (
    <BaseLayout>
      <PageHeader
        title="Ressuprimento"
        eyebrow="Administração"
        description="Organize a reposição de produtos por fornecedor."
        actions={<Button href="/cart">Ver Carrinho de Reposição</Button>}
      />
      {order && (
        <Alert variant="info">
          Um pedido de reposição está em andamento. Finalize-o antes de adicionar produtos de outro
          fornecedor.
        </Alert>
      )}
      {!products.length && <EmptyState title="Nenhum Produto para Repor" />}
      {suppliers
        .filter((s) => products.some((p) => p.supplier === s.id))
        .map((supplier) => (
          <section className="mb-8" key={supplier.id}>
            <h2 className="text-[23px] font-extrabold tracking-[-0.8px] mb-4">{supplier.name}</h2>
            <DataTable label={`Produtos de ${supplier.name}`}>
              <thead className="bg-[#3c2456]">
                <tr>
                  <TableHeader>Produto</TableHeader>
                  <TableHeader>Estoque</TableHeader>
                  <TableHeader>Preço de Custo</TableHeader>
                  <TableHeader>Ação</TableHeader>
                </tr>
              </thead>
              <tbody>
                {products
                  .filter((p) => p.supplier === supplier.id)
                  .map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="min-w-[160px]">{product.name}</TableCell>
                      <TableCell>{product.currentStockQuantity}</TableCell>
                      <TableCell>{money(product.costPrice)}</TableCell>
                      <TableCell>
                        {!order || order.supplier === product.supplier ? (
                          <Button
                            size="small"
                            href={`/purchase?productId=${product.id}`}
                            className="whitespace-nowrap"
                          >
                            Comprar para Reposição
                          </Button>
                        ) : (
                          <span className="text-sm text-brand-muted">
                            Outro fornecedor no carrinho
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </tbody>
            </DataTable>
          </section>
        ))}
    </BaseLayout>
  )
}
export const getServerSideProps = withSession(
  async ({ api, user }) => {
    const [products, suppliers, orders] = await Promise.all([
      api('products/'),
      api('suppliers/'),
      api(`orders/supplierOrder/getUnfinished/?user=${user.id}`),
    ])
    return { products, suppliers, order: orders[0] || null }
  },
  { admin: true }
)
