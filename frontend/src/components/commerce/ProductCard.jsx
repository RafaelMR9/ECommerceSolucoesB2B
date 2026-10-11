import Link from 'next/link'
import Image from 'next/image'
import Button from '@/components/ui/Button'
import { money, titleCase } from '@/lib/format'

export default function ProductCard({ product, category, promotion }) {
  return (
    <article className="product-card">
      <Link className="product-card-image" href={`/products/${product.id}`}>
        <Image
          src={product.image || '/images/product-placeholder.svg'}
          alt={product.name}
          fill
          sizes="(max-width: 520px) 95px, (max-width: 1050px) 33vw, 25vw"
          unoptimized
        />
      </Link>
      <p className="product-card-category">{titleCase(category?.name || 'Produto')}</p>
      <h3>
        <Link href={`/products/${product.id}`}>{product.name}</Link>
      </h3>
      <p className="product-card-price">
        {promotion && <span className="product-card-old-price">{money(product.salePrice)}</span>}
        {money(promotion?.salePrice ?? product.salePrice)}
      </p>
      <p className="product-card-pack">
        Embalagem: {product.packaging} {Number(product.packaging) === 1 ? 'unidade' : 'unidades'}
      </p>
      <Button href={`/products/${product.id}`}>Ver Produto</Button>
    </article>
  )
}
