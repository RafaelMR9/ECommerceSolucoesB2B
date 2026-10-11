import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'
import { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import BaseLayout from '@/components/shared/BaseLayout'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import Modal from '@/components/shared/Modal'
import { AuthContext } from '@/contexts/authContext'
import { removeProduct } from '@/services/productService'
import { money, activePromotion, errorFields } from '@/lib/format'
import { withSession } from '@/lib/server/page'

export default function Product({ product, category, supplier, promotion }) {
  const { user } = useContext(AuthContext),
    router = useRouter()
  const [confirm, setConfirm] = useState(false),
    [error, setError] = useState('')
  async function remove() {
    try {
      await removeProduct(product.id)
      await router.push('/products')
    } catch (e) {
      setError(Object.values(errorFields(e)).join(' '))
    } finally {
      setConfirm(false)
    }
  }
  return (
    <BaseLayout>
      <Head>
        <title>{`${product.name} · B2B Soluções`}</title>
      </Head>
      <Link className="back-link" href="/products">
        ← Voltar ao catálogo
      </Link>
      <Alert>{error}</Alert>
      <div className="product-detail">
        <div className="product-detail-image">
          <Image
            src={product.image || '/images/product-placeholder.svg'}
            alt={product.name}
            fill
            priority
            sizes="(max-width:760px) 100vw, 50vw"
            unoptimized
          />
        </div>
        <div className="product-detail-copy">
          <p className="eyebrow">{category.name}</p>
          <h1>{product.name}</h1>
          <div className="product-detail-price">
            {promotion && (
              <span className="product-card-old-price">{money(product.salePrice)}</span>
            )}
            {money(promotion?.salePrice ?? product.salePrice)} <small>por embalagem</small>
          </div>
          <p className="product-description">{product.description}</p>
          <dl className="detail-list">
            <div>
              <dt>Unidades por embalagem</dt>
              <dd>{product.packaging}</dd>
            </div>
            <div>
              <dt>Categoria</dt>
              <dd>
                <Link href={`/products?categoryId=${product.category}`}>{category.name}</Link>
              </dd>
            </div>
            {user.is_superuser && (
              <>
                <div>
                  <dt>Estoque atual</dt>
                  <dd>{product.currentStockQuantity}</dd>
                </div>
                <div>
                  <dt>Fornecedor</dt>
                  <dd>
                    <Link href={`/suppliers/${supplier.id}`}>{supplier.name}</Link>
                  </dd>
                </div>
              </>
            )}
          </dl>
          {!user.is_superuser && (
            <div className="detail-actions">
              {user.canPurchase ? (
                <Button
                  href={`/purchase?productId=${product.id}`}
                  disabled={product.currentStockQuantity <= 0}
                >
                  {product.currentStockQuantity > 0 ? 'Comprar produto' : 'Sem estoque'}
                </Button>
              ) : (
                <Alert variant="info">
                  Regularize os pagamentos pendentes para realizar novas compras.
                </Alert>
              )}
            </div>
          )}
          {user.is_superuser && (
            <div className="detail-admin">
              <p className="eyebrow">Gerenciar produto</p>
              <div className="detail-actions">
                <Button href={`/products/update?productId=${product.id}`} variant="secondary">
                  Editar produto
                </Button>
                <Button
                  href={`/products/register-promotion?productId=${product.id}`}
                  variant="secondary"
                >
                  Cadastrar promoção
                </Button>
                <Button variant="danger" onClick={() => setConfirm(true)}>
                  Remover produto
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Modal
        isOpen={confirm}
        title="Remover produto"
        message={`Deseja remover “${product.name}” do catálogo?`}
        option1="Remover"
        option2="Cancelar"
        onClose={() => setConfirm(false)}
        onConfirm={remove}
      />
    </BaseLayout>
  )
}
export const getServerSideProps = withSession(async ({ api, params, user }) => {
  if (!/^\d+$/.test(params.productId)) return { notFound: true }
  const product = await api(`products/${params.productId}/detail/`)
  if (!product.visible && !user.is_superuser) return { notFound: true }
  const [category, promotions, supplier] = await Promise.all([
    api(`products/categories/${product.category}/detail/`),
    api('marketing/'),
    user.is_superuser ? api(`suppliers/${product.supplier}/detail/`) : Promise.resolve(null),
  ])
  return {
    product,
    category,
    supplier,
    promotion: activePromotion(product, promotions, Date.now()) || null,
  }
})
