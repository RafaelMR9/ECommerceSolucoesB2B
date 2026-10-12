import { useContext } from 'react'
import BaseLayout from '@/components/shared/BaseLayout'
import Button from '@/components/ui/Button'
import PageHeader from '@/components/ui/PageHeader'
import EmptyState from '@/components/ui/EmptyState'
import ProductCard from '@/components/commerce/ProductCard'
import CatalogFilters from '@/components/categories/CatalogFilters'
import { AuthContext } from '@/contexts/authContext'
import { titleCase, normalizeSearch } from '@/lib/format'
import { productCards } from '@/lib/catalog'
import { withSession } from '@/lib/server/page'

export default function Products({ cards, categories, search, categoryId }) {
  const { user } = useContext(AuthContext)
  return (
    <BaseLayout>
      <PageHeader
        title="Catálogo de Produtos"
        description="Encontre os essenciais que acompanham a rotina da sua empresa."
        actions={user.is_superuser && <Button href="/products/register">Cadastrar Produto</Button>}
      />
      <div className="grid grid-cols-[260px_minmax(0,_1fr)] gap-7 max-[760px]:grid-cols-1 max-[760px]:gap-5">
        <CatalogFilters categories={categories} categoryId={categoryId} />
        <div>
          <div className="flex justify-between items-center text-small text-brand-muted mb-[17px] gap-3 flex-wrap">
            <p>
              {search
                ? `Resultados para “${search}”`
                : categoryId
                  ? titleCase(
                      categories.find((c) => String(c.id) === categoryId)?.name || 'Categoria'
                    )
                  : 'Todos os Produtos'}{' '}
              · {cards.length} {cards.length === 1 ? 'produto' : 'produtos'}
            </p>
            {(search || categoryId) && (
              <Button href="/products" variant="ghost">
                Limpar Filtros
              </Button>
            )}
          </div>
          {cards.length ? (
            <section
              className="grid gap-4 max-[760px]:grid-cols-2 max-[520px]:grid-cols-1 grid-cols-3 max-[1050px]:grid-cols-2"
              aria-label="Produtos"
            >
              {cards.map(({ product, categoryName, promotion }, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  priority={index < 3}
                  categoryName={categoryName}
                  promotion={promotion}
                />
              ))}
            </section>
          ) : (
            <EmptyState
              title="Nenhum Produto Encontrado"
              description="Tente buscar por outro nome ou escolher outra categoria."
              action={<Button href="/products">Ver Todo o Catálogo</Button>}
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
  const normalizedSearch = normalizeSearch(search)
  const products = allProducts.filter(
    (p) =>
      (!categoryId || String(p.category) === categoryId) &&
      (!normalizedSearch || normalizeSearch(p.name).includes(normalizedSearch))
  )
  return {
    cards: productCards(products, categories, promotions, Date.now()),
    categories,
    search,
    categoryId,
  }
})
