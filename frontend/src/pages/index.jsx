import Head from 'next/head'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import BaseLayout from '@/components/shared/BaseLayout'
import Hero from '@/components/commerce/Hero'
import ServiceStrip from '@/components/commerce/ServiceStrip'
import RecurringBanner from '@/components/commerce/RecurringBanner'
import CategoryCard from '@/components/commerce/CategoryCard'
import ProductCard from '@/components/commerce/ProductCard'
import EmptyState from '@/components/ui/EmptyState'
import { activePromotion } from '@/lib/format'
import { withSession } from '@/lib/server/page'

export default function Home({ products, categories, promotions, now }) {
  return (
    <BaseLayout fullWidth>
      <Head>
        <title>B2B Soluções · Sua empresa em movimento</title>
      </Head>
      <Hero />
      <ServiceStrip />
      <div className="home-main site-width">
        <div className="section-heading">
          <div>
            <h2 className="section-title">O Que Sua Empresa Precisa?</h2>
            <p>Encontre seu próximo essencial</p>
          </div>
          <Link className="button button-ghost" href="/categories">
            Ver Categorias
            <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>
        {categories.length ? (
          <section className="category-grid" aria-label="Categorias">
            {categories.slice(0, 4).map((category) => (
              <CategoryCard category={category} key={category.id} />
            ))}
          </section>
        ) : (
          <EmptyState title="Nenhuma Categoria Cadastrada" />
        )}
        <div className="section-heading">
          <div>
            <h2 className="section-title">Catálogo de Produtos</h2>
            <p>Essenciais para sua organização</p>
          </div>
          <Link className="button button-ghost" href="/products">
            Todos os Produtos
            <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>
        {products.length ? (
          <section className="product-grid" aria-label="Produtos">
            {products.slice(0, 8).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                category={categories.find((c) => c.id === product.category)}
                promotion={activePromotion(product, promotions, now)}
              />
            ))}
          </section>
        ) : (
          <EmptyState title="Nenhum Produto Cadastrado" />
        )}
        <RecurringBanner />
      </div>
    </BaseLayout>
  )
}
export const getServerSideProps = withSession(async ({ api }) => {
  const [products, categories, promotions] = await Promise.all([
    api('products/'),
    api('products/categories/'),
    api('marketing/'),
  ])
  return { products, categories, promotions, now: Date.now() }
})
