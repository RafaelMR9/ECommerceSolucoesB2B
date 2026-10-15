import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Package } from 'lucide-react'
import Button from '@/components/ui/Button'
import { money, titleCase } from '@/lib/format'

export default function ProductCard({ product, categoryName, promotion, preload = false }) {
  const href = `/products/${product.id}`
  const price = promotion?.salePrice ?? product.salePrice
  const discounted = Number(price) < Number(product.salePrice)
  const discount = discounted
    ? Math.floor((1 - Number(price) / Number(product.salePrice)) * 100)
    : 0
  return (
    <article className="flex flex-col min-w-0 bg-white border border-[#dccbea] rounded-[18px] overflow-hidden shadow-product transition-shadow duration-200 max-[520px]:grid max-[520px]:grid-cols-[110px_minmax(0,1fr)] max-[360px]:grid-cols-[85px_minmax(0,1fr)] hover:shadow-product-hover focus-within:shadow-product-hover">
      <Link
        className="block relative p-3.5 bg-[linear-gradient(135deg,#f3eafa,#faf7fd)] border-b border-b-[#e8dcf0] max-[520px]:p-2.5 max-[520px]:flex max-[520px]:items-center max-[520px]:border-b-0 max-[520px]:border-r max-[520px]:border-r-[#e8dcf0] max-[360px]:p-1.75 focus-visible:outline-offset-[-5px] group/product-card-media"
        href={href}
        aria-label={`Ver ${product.name}`}
      >
        <span className="block relative h-46 bg-white rounded-xl shadow-[0_2px_8px_#30124005] overflow-hidden max-[520px]:w-full max-[520px]:h-40">
          <Image
            className="object-contain p-3.5 transition-transform duration-200 max-[520px]:p-2 group-hover/product-card-media:scale-[1.04]"
            src={product.image || '/images/product-placeholder.svg'}
            alt={product.name}
            fill
            preload={preload}
            sizes="(max-width: 520px) 110px, (max-width: 1050px) 33vw, 25vw"
            unoptimized
          />
        </span>
        {discounted && (
          <span className="absolute top-5.25 left-5.25 rounded-[7px] py-1.25 px-2.25 bg-[#6023af] text-white text-small font-extrabold max-[520px]:top-2.5 max-[520px]:left-2.5">
            {discount ? `−${discount}%` : 'Oferta'}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col min-w-0 p-4.5 max-[520px]:py-3.5 max-[520px]:px-3 max-[360px]:py-3 max-[360px]:px-2.5">
        <p className="self-start py-1 px-2.25 rounded-md bg-[#f3ebfc] text-[#63358a] text-caption font-semibold mb-2.5 wrap-anywhere">
          {titleCase(categoryName || 'Produto')}
        </p>
        <h3 className="min-h-12 text-body font-extrabold leading-normal tracking-[-0.3px] wrap-anywhere max-[520px]:min-h-0">
          <Link
            className="hover:text-[#6023af] hover:underline hover:underline-offset-4"
            href={href}
          >
            {product.name}
          </Link>
        </h3>
        <p className="flex items-start gap-1.75 text-brand-muted text-small mt-2.75 mr-0 mb-4.5 ml-0 max-[520px]:mt-2.25 max-[520px]:mr-0 max-[520px]:mb-3.25 max-[520px]:ml-0">
          <Package className="text-[#8152a8] shrink-0 mt-0.5" size={17} aria-hidden="true" />
          <span>
            <strong className="font-semibold text-[#463153]">
              {product.packaging} {Number(product.packaging) === 1 ? 'unidade' : 'unidades'}
            </strong>{' '}
            por embalagem
          </span>
        </p>
        <div className="mt-auto rounded-[10px] p-3 bg-[#f8f3fc] border border-[#eadff2] max-[520px]:p-2.5 max-[360px]:p-2.25">
          <div className="flex flex-wrap items-center gap-y-1 gap-x-2.25 text-[#65516f] text-caption">
            <span>Por Embalagem</span>
            {discounted && <del className="text-brand-muted">De {money(product.salePrice)}</del>}
          </div>
          <p className="text-[#512278] text-[25px] font-extrabold tracking-[-0.7px] leading-[1.3] mt-1 wrap-anywhere tabular-nums max-[520px]:text-[22px]">
            {money(price)}
          </p>
        </div>
        <Button className="mt-3 w-full min-h-11.5 rounded-[10px] max-[360px]:p-2.5" href={href}>
          Ver Produto <ArrowUpRight className="shrink-0" size={18} aria-hidden="true" />
        </Button>
      </div>
    </article>
  )
}
