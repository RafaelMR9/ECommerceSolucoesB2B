import BaseLayout from '@/components/shared/BaseLayout'
import PageHeader from '@/components/ui/PageHeader'
import DataTable from '@/components/ui/DataTable'
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
        actions={
          <Button href="/cart" variant="secondary">
            Ver Carrinho de Reposição
          </Button>
        }
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
            <h2 className="section-title mb-4">{supplier.name}</h2>
            <DataTable label={`Produtos de ${supplier.name}`}>
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Estoque</th>
                  <th>Preço de Custo</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {products
                  .filter((p) => p.supplier === supplier.id)
                  .map((product) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.currentStockQuantity}</td>
                      <td>{money(product.costPrice)}</td>
                      <td>
                        {!order || order.supplier === product.supplier ? (
                          <Button
                            href={`/purchase?productId=${product.id}`}
                            className="button-small"
                          >
                            Comprar para Reposição
                          </Button>
                        ) : (
                          <span className="text-sm text-gray-500">
                            Outro fornecedor no carrinho
                          </span>
                        )}
                      </td>
                    </tr>
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
