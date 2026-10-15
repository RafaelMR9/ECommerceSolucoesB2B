import Button from '@/components/ui/Button'
import Container from '@/components/shared/Container'
import { ArrowUpRight } from 'lucide-react'
import BaseLayout from '@/components/shared/BaseLayout'
import Hero from '@/components/commerce/Hero'
import RecurringBanner from '@/components/commerce/RecurringBanner'
import CategoryCard from '@/components/commerce/CategoryCard'
import ProductCard from '@/components/commerce/ProductCard'
import EmptyState from '@/components/ui/EmptyState'
import { productCards } from '@/lib/catalog'
import { withSession } from '@/lib/server/page'

export default function Home({ cards, categories }) {
  return (
    <BaseLayout fullWidth>
      <Hero />
      <Container className="pt-8 pb-10">
        <div className="flex items-center justify-between gap-3.5 mb-5 flex-wrap">
          <div>
            <h2 className="text-[23px] font-extrabold tracking-[-0.8px]">
              O Que Sua Empresa Precisa?
            </h2>
            <p className="text-small text-brand-muted mt-1">Encontre seu próximo essencial</p>
          </div>
          <Button variant="ghost" href="/categories">
            Ver Categorias
            <ArrowUpRight className="shrink-0" size={15} aria-hidden="true" />
          </Button>
        </div>
        {categories.length ? (
          <section
            className="grid grid-cols-4 gap-3 mb-8.75 max-[1050px]:grid-cols-2 max-[520px]:gap-2.25"
            aria-label="Categorias"
          >
            {categories.map((category) => (
              <CategoryCard category={category} key={category.id} />
            ))}
          </section>
        ) : (
          <EmptyState title="Nenhuma Categoria Cadastrada" />
        )}
        <div className="flex items-center justify-between gap-3.5 mb-5 flex-wrap">
          <div>
            <h2 className="text-[23px] font-extrabold tracking-[-0.8px]">Catálogo de Produtos</h2>
            <p className="text-small text-brand-muted mt-1">Essenciais para sua organização</p>
          </div>
          <Button variant="ghost" href="/products">
            Todos os Produtos
            <ArrowUpRight className="shrink-0" size={15} aria-hidden="true" />
          </Button>
        </div>
        {cards.length ? (
          <section
            className="grid grid-cols-4 gap-4 max-[1050px]:grid-cols-3 max-[760px]:grid-cols-2 max-[520px]:grid-cols-1"
            aria-label="Produtos"
          >
            {cards.map(({ product, categoryName, promotion }) => (
              <ProductCard
                key={product.id}
                product={product}
                categoryName={categoryName}
                promotion={promotion}
              />
            ))}
          </section>
        ) : (
          <EmptyState title="Nenhum Produto Cadastrado" />
        )}
        <RecurringBanner />
      </Container>
    </BaseLayout>
  )
}
export const getServerSideProps = withSession(async ({ api }) => {
  const [products, categories, promotions] = await Promise.all([
    api('products/'),
    api('products/categories/'),
    api('marketing/'),
  ])
  return {
    cards: productCards(products.slice(0, 8), categories, promotions, Date.now()),
    categories: categories.slice(0, 4),
  }
})
