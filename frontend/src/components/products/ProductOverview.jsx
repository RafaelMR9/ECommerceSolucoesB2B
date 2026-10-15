import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Boxes, Building2, Package, Pencil, Tag, Tags, Trash2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import StatusBadge from '@/components/ui/StatusBadge'
import DetailItem from '@/components/ui/DetailItem'
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
      <div className="grid grid-cols-2 gap-9 items-start max-[760px]:grid-cols-1 max-[760px]:gap-6.5">
        <div className="p-5.5 bg-[linear-gradient(145deg,#eee3fc,#f7f3fb)] border border-[#d7c7e8] rounded-[20px] max-[520px]:p-4">
          <p className="text-caption font-bold text-[#573479] mb-5">Catálogo B2B</p>
          <div className="relative min-h-105 bg-white rounded-[15px] shadow-[0_8px_28px_#35144b0d] max-[520px]:min-h-70">
            <Image
              className="object-contain p-8.75 max-[520px]:p-6.25"
              src={product.image || '/images/product-placeholder.svg'}
              alt={product.name}
              fill
              preload
              sizes="(max-width:760px) 100vw, 50vw"
              unoptimized
            />
          </div>
          <p className="mt-5 text-[#573479] text-small font-semibold">Produto #{product.id}</p>
        </div>
        <div>
          <Link
            className="inline-flex max-w-full gap-2 items-center bg-brand-accent-soft text-[#54267c] border border-[#d6bcec] py-1.75 px-3 rounded-lg text-small font-bold hover:bg-[#e8d8fc]"
            href={`/products?categoryId=${category.id}`}
          >
            <Tags className="shrink-0" size={15} aria-hidden="true" />
            <span className="min-w-0 wrap-anywhere">{titleCase(category.name)}</span>
          </Link>
          <h1 className="text-[clamp(28px,3vw,38px)] leading-[1.2] font-extrabold tracking-[-1px] my-4.5 mx-0">
            {product.name}
          </h1>
          <div className="flex gap-2 flex-wrap mb-5.75">
            <StatusBadge variant={available ? 'success' : 'danger'}>
              {available ? 'Disponível' : 'Sem Estoque'}
            </StatusBadge>
            {promotion && <StatusBadge variant="accent">Preço Promocional</StatusBadge>}
          </div>
          <div className="p-6 border border-[#d1b9ec] border-l-4 border-l-brand-accent rounded-panel bg-[linear-gradient(110deg,#f0e4ff,#faf7ff)] max-[520px]:p-5">
            <p className="text-[#4f3567] text-small font-semibold mb-2">Preço por Embalagem</p>
            {promotion && Number(promotion.salePrice) < Number(product.salePrice) && (
              <del className="text-small text-brand-muted">De {money(product.salePrice)}</del>
            )}
            <strong className="text-[#6521ba] text-[clamp(32px,3.5vw,43px)] font-extrabold tracking-[-1px] block leading-[1.2] mb-2.5 wrap-anywhere">
              {money(promotion?.salePrice ?? product.salePrice)}
            </strong>
            <span className="text-small text-brand-muted">
              {product.packaging} {Number(product.packaging) === 1 ? 'unidade' : 'unidades'} em cada
              embalagem
            </span>
            {!user.is_superuser && (
              <div className="flex gap-2.25 flex-wrap mt-5">
                {user.canPurchase ? (
                  <Button
                    className="w-full justify-between min-h-12.5"
                    href={`/purchase?productId=${product.id}`}
                    disabled={!available}
                  >
                    {' '}
                    {available ? 'Comprar Produto' : 'Sem Estoque'}
                    <ArrowRight className="shrink-0" size={18} aria-hidden="true" />
                  </Button>
                ) : (
                  <Alert variant="info" className="m-0">
                    Regularize os pagamentos pendentes para realizar novas compras.
                  </Alert>
                )}
              </div>
            )}
          </div>
          <dl className="grid grid-cols-2 gap-3.5 mt-5.5 max-[520px]:gap-2.5">
            <DetailItem boxed label="Embalagem" icon={Package}>
              {product.packaging} {Number(product.packaging) === 1 ? 'Unidade' : 'Unidades'}
            </DetailItem>
            <DetailItem boxed label="Categoria" icon={Tags}>
              <Link
                className="hover:text-brand-accent hover:underline"
                href={`/products?categoryId=${category.id}`}
              >
                {titleCase(category.name)}
              </Link>
            </DetailItem>
            {user.is_superuser && (
              <>
                <DetailItem boxed label="Estoque Atual" icon={Boxes}>
                  {product.currentStockQuantity} Embalagens
                </DetailItem>
                <DetailItem boxed label="Fornecedor" icon={Building2}>
                  <Link
                    className="hover:text-brand-accent hover:underline"
                    href={`/suppliers/${supplier.id}`}
                  >
                    {supplier.name}
                  </Link>
                </DetailItem>
              </>
            )}
          </dl>
          {user.is_superuser && (
            <section className="mt-6.25 pt-5.75 border-t border-t-brand-border">
              <h2 className="text-ui font-bold">Gerenciar Produto</h2>
              <div className="flex gap-2.25 flex-wrap mt-3.25">
                <Button className="text-small" href={`/products/update?productId=${product.id}`}>
                  <Pencil className="shrink-0" size={16} aria-hidden="true" />
                  Editar Produto
                </Button>
                <Button
                  className="text-small"
                  href={`/products/register-promotion?productId=${product.id}`}
                  variant="secondary"
                >
                  <Tag className="shrink-0" size={16} aria-hidden="true" />
                  Cadastrar Promoção
                </Button>
                <Button className="text-small" variant="danger" onClick={onRemove}>
                  <Trash2 className="shrink-0" size={16} aria-hidden="true" />
                  Remover Produto
                </Button>
              </div>
            </section>
          )}
        </div>
      </div>
      <section className="mt-7.5 grid grid-cols-[260px_minmax(0,1fr)] gap-8 p-7 border border-brand-border rounded-[15px] bg-white max-[760px]:grid-cols-1 max-[760px]:gap-4.5 max-[520px]:p-5.5">
        <div>
          <span className="text-brand-accent text-caption font-extrabold tracking-[1.2px] mb-2.5">
            Conheça o Produto
          </span>
          <h2 className="text-[23px] font-extrabold leading-[1.3] tracking-[-0.6px] mt-2.25">
            Detalhes para Sua Compra
          </h2>
        </div>
        <p className="text-brand-muted text-body leading-[1.9] whitespace-pre-line">
          {product.description || 'Este produto ainda não possui uma descrição.'}
        </p>
      </section>
    </>
  )
}
