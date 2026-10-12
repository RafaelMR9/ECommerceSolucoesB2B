import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Boxes, Building2, Package, Pencil, Tag, Tags, Trash2 } from 'lucide-react'
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
      <div className="grid grid-cols-2 gap-9 items-start max-[760px]:grid-cols-1 max-[760px]:gap-[26px]">
        <div className="p-[22px] bg-[linear-gradient(145deg,_#eee3fc,_#f7f3fb)] border border-[#d7c7e8] rounded-[20px] max-[520px]:p-4">
          <p className="text-caption font-bold text-[#573479] mb-5">Catálogo B2B</p>
          <div className="relative min-h-[420px] bg-white rounded-[15px] shadow-[0_8px_28px_#35144b0d] max-[520px]:min-h-[280px]">
            <Image
              className="object-contain p-[35px] max-[520px]:p-[25px]"
              src={product.image || '/images/product-placeholder.svg'}
              alt={product.name}
              fill
              priority
              sizes="(max-width:760px) 100vw, 50vw"
              unoptimized
            />
          </div>
          <p className="mt-5 text-[#573479] text-small font-semibold">Produto #{product.id}</p>
        </div>
        <div>
          <Link
            className="inline-flex gap-2 items-center bg-brand-accent-soft text-[#54267c] border border-[#d6bcec] py-[7px] px-3 rounded-lg text-small font-bold hover:bg-[#e8d8fc]"
            href={`/products?categoryId=${category.id}`}
          >
            <Tags size={15} aria-hidden="true" />
            {titleCase(category.name)}
          </Link>
          <h1 className="text-[clamp(28px,_3vw,_38px)] leading-[1.2] font-extrabold tracking-[-1px] my-4.5 mx-0">
            {product.name}
          </h1>
          <div className="flex gap-2 flex-wrap mb-[23px]">
            <StatusBadge variant={available ? 'success' : 'danger'}>
              {available ? 'Disponível' : 'Sem Estoque'}
            </StatusBadge>
            {promotion && <StatusBadge variant="accent">Preço Promocional</StatusBadge>}
          </div>
          <div className="p-6 border border-[#d1b9ec] border-l-4 border-l-brand-accent rounded-[14px] bg-[linear-gradient(110deg,_#f0e4ff,_#faf7ff)] max-[520px]:p-5">
            <p className="text-[#4f3567] text-small font-semibold mb-2">Preço por Embalagem</p>
            {promotion && (
              <span className="text-brand-muted last-of-type:text-brand-muted last-of-type:text-small">
                {money(product.salePrice)}
              </span>
            )}
            <strong className="text-[#6521ba] text-[clamp(32px,_3.5vw,_43px)] font-extrabold tracking-[-1px] block leading-[1.2] mb-2.5">
              {money(promotion?.salePrice ?? product.salePrice)}
            </strong>
            <span className="last-of-type:text-brand-muted last-of-type:text-small">
              {product.packaging} {Number(product.packaging) === 1 ? 'unidade' : 'unidades'} em cada
              embalagem
            </span>
            {!user.is_superuser && (
              <div className="flex gap-[9px] flex-wrap mt-5">
                {user.canPurchase ? (
                  <Button
                    className="w-full justify-between min-h-[50px]"
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
          <dl className="grid grid-cols-2 gap-3.5 mt-[22px] max-[520px]:gap-2.5">
            <div className="relative bg-white border border-brand-border rounded-[10px] pt-[17px] pr-3.5 pb-[17px] pl-[43px] min-w-0 max-[520px]:py-4 max-[520px]:px-3">
              <Package
                className="absolute left-3.5 top-[19px] text-brand-accent max-[520px]:static max-[520px]:mb-2.5"
                size={19}
                aria-hidden="true"
              />
              <dt className="text-brand-muted text-caption mb-1.5">Embalagem</dt>
              <dd className="text-ui font-bold [overflow-wrap:anywhere]">
                {product.packaging} {Number(product.packaging) === 1 ? 'Unidade' : 'Unidades'}
              </dd>
            </div>
            <div className="relative bg-white border border-brand-border rounded-[10px] pt-[17px] pr-3.5 pb-[17px] pl-[43px] min-w-0 max-[520px]:py-4 max-[520px]:px-3">
              <Tags
                className="absolute left-3.5 top-[19px] text-brand-accent max-[520px]:static max-[520px]:mb-2.5"
                size={19}
                aria-hidden="true"
              />
              <dt className="text-brand-muted text-caption mb-1.5">Categoria</dt>
              <dd className="text-ui font-bold [overflow-wrap:anywhere]">
                <Link
                  className="hover:text-brand-accent hover:underline"
                  href={`/products?categoryId=${category.id}`}
                >
                  {titleCase(category.name)}
                </Link>
              </dd>
            </div>
            {user.is_superuser && (
              <>
                <div className="relative bg-white border border-brand-border rounded-[10px] pt-[17px] pr-3.5 pb-[17px] pl-[43px] min-w-0 max-[520px]:py-4 max-[520px]:px-3">
                  <Boxes
                    className="absolute left-3.5 top-[19px] text-brand-accent max-[520px]:static max-[520px]:mb-2.5"
                    size={19}
                    aria-hidden="true"
                  />
                  <dt className="text-brand-muted text-caption mb-1.5">Estoque Atual</dt>
                  <dd className="text-ui font-bold [overflow-wrap:anywhere]">
                    {product.currentStockQuantity} Embalagens
                  </dd>
                </div>
                <div className="relative bg-white border border-brand-border rounded-[10px] pt-[17px] pr-3.5 pb-[17px] pl-[43px] min-w-0 max-[520px]:py-4 max-[520px]:px-3">
                  <Building2
                    className="absolute left-3.5 top-[19px] text-brand-accent max-[520px]:static max-[520px]:mb-2.5"
                    size={19}
                    aria-hidden="true"
                  />
                  <dt className="text-brand-muted text-caption mb-1.5">Fornecedor</dt>
                  <dd className="text-ui font-bold [overflow-wrap:anywhere]">
                    <Link
                      className="hover:text-brand-accent hover:underline"
                      href={`/suppliers/${supplier.id}`}
                    >
                      {supplier.name}
                    </Link>
                  </dd>
                </div>
              </>
            )}
          </dl>
          {user.is_superuser && (
            <section className="mt-[25px] pt-[23px] border-t border-t-brand-border">
              <h2 className="text-ui font-bold">Gerenciar Produto</h2>
              <div className="flex gap-[9px] flex-wrap mt-[13px]">
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
      <section className="mt-[30px] grid grid-cols-[260px_minmax(0,_1fr)] gap-8 p-7 border border-brand-border rounded-[15px] bg-white max-[760px]:grid-cols-1 max-[760px]:gap-4.5 max-[520px]:p-[22px]">
        <div>
          <span className="text-brand-accent text-caption font-extrabold tracking-[1.2px] normal-case mb-2.5">
            Conheça o Produto
          </span>
          <h2 className="text-[23px] font-extrabold leading-[1.3] tracking-[-0.6px] mt-[9px]">
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
