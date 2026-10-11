import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  Boxes,
  Building2,
  LayoutGrid,
  Package,
  Pencil,
  Tag,
  Trash2,
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import StatusBadge from '@/components/ui/StatusBadge'
import { money, titleCase } from '@/lib/format'

export default function ProductOverview({
  product,
  category,
  supplier,
  promotion,
  user,
  onRemove,
}) {
  const available = product.currentStockQuantity > 0
  return (
    <>
      <div className="product-detail">
        <div className="product-gallery">
          <div className="product-gallery-heading">
            <span>Catálogo B2B</span>
            <span>Produto #{product.id}</span>
          </div>
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
          <div className="product-gallery-caption">
            <Package size={19} aria-hidden="true" />
            <span>
              {product.packaging} {Number(product.packaging) === 1 ? 'Unidade' : 'Unidades'} por
              Embalagem
            </span>
          </div>
        </div>
        <div className="product-detail-copy">
          <Link className="product-category-pill" href={`/products?categoryId=${category.id}`}>
            <LayoutGrid size={15} aria-hidden="true" />
            {titleCase(category.name)}
          </Link>
          <h1>{product.name}</h1>
          <div className="product-availability">
            <StatusBadge variant={available ? 'success' : 'danger'}>
              {available ? 'Disponível' : 'Sem Estoque'}
            </StatusBadge>
            {promotion && <StatusBadge variant="accent">Preço Promocional</StatusBadge>}
          </div>
          <div className="product-price-panel">
            <p>Preço por Embalagem</p>
            {promotion && (
              <span className="product-card-old-price">{money(product.salePrice)}</span>
            )}
            <strong className="product-detail-price">
              {money(promotion?.salePrice ?? product.salePrice)}
            </strong>
            <span>
              {product.packaging} {Number(product.packaging) === 1 ? 'unidade' : 'unidades'} em cada
              embalagem
            </span>
            {!user.is_superuser && (
              <div className="detail-actions">
                {user.canPurchase ? (
                  <Button href={`/purchase?productId=${product.id}`} disabled={!available}>
                    {' '}
                    {available ? 'Comprar Produto' : 'Sem Estoque'}
                    <ArrowRight size={18} aria-hidden="true" />
                  </Button>
                ) : (
                  <Alert variant="info">
                    Regularize os pagamentos pendentes para realizar novas compras.
                  </Alert>
                )}
              </div>
            )}
          </div>
          <dl className="detail-list">
            <div>
              <Package size={19} aria-hidden="true" />
              <dt>Embalagem</dt>
              <dd>
                {product.packaging} {Number(product.packaging) === 1 ? 'Unidade' : 'Unidades'}
              </dd>
            </div>
            <div>
              <LayoutGrid size={19} aria-hidden="true" />
              <dt>Categoria</dt>
              <dd>
                <Link href={`/products?categoryId=${category.id}`}>{titleCase(category.name)}</Link>
              </dd>
            </div>
            {user.is_superuser && (
              <>
                <div>
                  <Boxes size={19} aria-hidden="true" />
                  <dt>Estoque Atual</dt>
                  <dd>{product.currentStockQuantity} Embalagens</dd>
                </div>
                <div>
                  <Building2 size={19} aria-hidden="true" />
                  <dt>Fornecedor</dt>
                  <dd>
                    <Link href={`/suppliers/${supplier.id}`}>{supplier.name}</Link>
                  </dd>
                </div>
              </>
            )}
          </dl>
          {user.is_superuser && (
            <section className="detail-admin">
              <h2>Gerenciar Produto</h2>
              <div className="detail-actions">
                <Button href={`/products/update?productId=${product.id}`}>
                  <Pencil size={16} aria-hidden="true" />
                  Editar Produto
                </Button>
                <Button
                  href={`/products/register-promotion?productId=${product.id}`}
                  variant="secondary"
                >
                  <Tag size={16} aria-hidden="true" />
                  Cadastrar Promoção
                </Button>
                <Button variant="danger" onClick={onRemove}>
                  <Trash2 size={16} aria-hidden="true" />
                  Remover Produto
                </Button>
              </div>
            </section>
          )}
        </div>
      </div>
      <section className="product-description-panel">
        <div>
          <span className="eyebrow">Conheça o Produto</span>
          <h2>Detalhes para Sua Compra</h2>
        </div>
        <p>{product.description || 'Este produto ainda não possui uma descrição.'}</p>
      </section>
    </>
  )
}
