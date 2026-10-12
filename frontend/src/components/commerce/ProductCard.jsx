import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Package } from 'lucide-react'
import Button from '@/components/ui/Button'
import { money, titleCase } from '@/lib/format'

export default function ProductCard({ product, category, promotion }) {
  const href = `/products/${product.id}`
  const price = promotion?.salePrice ?? product.salePrice
  const discounted = Number(price) < Number(product.salePrice)
  const discount = discounted
    ? Math.floor((1 - Number(price) / Number(product.salePrice)) * 100)
    : 0
  return (
    <article className="product-card">
      <Link className="product-card-media" href={href} aria-label={`Ver ${product.name}`}>
        <span className="product-card-image">
          <Image
            src={product.image || '/images/product-placeholder.svg'}
            alt={product.name}
            fill
            sizes="(max-width: 520px) 110px, (max-width: 1050px) 33vw, 25vw"
            unoptimized
          />
        </span>
        {discounted && (
          <span className="product-card-promotion">{discount ? `−${discount}%` : 'Oferta'}</span>
        )}
      </Link>
      <div className="product-card-body">
        <p className="product-card-category">{titleCase(category?.name || 'Produto')}</p>
        <h3>
          <Link href={href}>{product.name}</Link>
        </h3>
        <p className="product-card-pack">
          <Package size={17} aria-hidden="true" />
          <span>
            <strong>
              {product.packaging} {Number(product.packaging) === 1 ? 'unidade' : 'unidades'}
            </strong>{' '}
            por embalagem
          </span>
        </p>
        <div className="product-card-pricing">
          <div className="product-card-price-label">
            <span>Por Embalagem</span>
            {discounted && (
              <del className="product-card-old-price">De {money(product.salePrice)}</del>
            )}
          </div>
          <p className="product-card-price">{money(price)}</p>
        </div>
        <Button href={href}>
          Ver Produto <ArrowUpRight size={18} aria-hidden="true" />
        </Button>
      </div>
    </article>
  )
}
