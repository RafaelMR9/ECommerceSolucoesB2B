import Link from 'next/link'
import { useContext } from 'react'
import BaseLayout from '@/components/shared/BaseLayout'
import Button from '@/components/ui/Button'
import PageHeader from '@/components/ui/PageHeader'
import EmptyState from '@/components/ui/EmptyState'
import ProductCard from '@/components/commerce/ProductCard'
import { AuthContext } from '@/contexts/authContext'
import { activePromotion } from '@/lib/format'
import { withSession } from '@/lib/server/page'

export default function Products({ products, categories, promotions, now, search, categoryId }) {
  const { user } = useContext(AuthContext)
  return (
    <BaseLayout>
      <PageHeader
        title="Catálogo de produtos"
        description="Encontre os essenciais que acompanham a rotina da sua empresa."
        actions={user.is_superuser && <Button href="/products/register">Cadastrar produto</Button>}
      />
      <div className="catalog-layout">
        <aside className="catalog-sidebar">
          <h2>Categorias</h2>
          <nav aria-label="Filtrar por categoria">
            <Link href="/products" aria-current={!categoryId}>
              Todos os produtos
            </Link>
            {categories.map((c) => (
              <Link
                href={`/products?categoryId=${c.id}`}
                key={c.id}
                aria-current={String(c.id) === categoryId}
              >
                {c.name}
              </Link>
            ))}
          </nav>
        </aside>
        <div>
          <div className="catalog-summary">
            <p>
              {search
                ? `Resultados para “${search}”`
                : categoryId
                  ? categories.find((c) => String(c.id) === categoryId)?.name
                  : 'Todos os produtos'}{' '}
              · {products.length} {products.length === 1 ? 'produto' : 'produtos'}
            </p>
            {(search || categoryId) && (
              <Button href="/products" variant="ghost">
                Limpar filtros
              </Button>
            )}
          </div>
          {products.length ? (
            <section className="product-grid" aria-label="Produtos">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  category={categories.find((c) => c.id === product.category)}
                  promotion={activePromotion(product, promotions, now)}
                />
              ))}
            </section>
          ) : (
            <EmptyState
              title="Nenhum produto encontrado"
              description="Tente buscar por outro nome ou escolher outra categoria."
              action={
                <Button href="/products" variant="secondary">
                  Ver todo o catálogo
                </Button>
              }
            />
          )}
        </div>
      </div>
    </BaseLayout>
  )
}
export const getServerSideProps = withSession(async ({ api, query }) => {
  const search = typeof query.fetchProduct === 'string' ? query.fetchProduct : '',
    categoryId = typeof query.categoryId === 'string' ? query.categoryId : ''
  const [allProducts, categories, promotions] = await Promise.all([
    api('products/'),
    api('products/categories/'),
    api('marketing/'),
  ])
  const products = allProducts.filter(
    (p) =>
      (!categoryId || String(p.category) === categoryId) &&
      (!search || p.name.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR')))
  )
  return { products, categories, promotions, now: Date.now(), search, categoryId }
})
