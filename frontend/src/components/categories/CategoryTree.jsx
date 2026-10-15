import Link from 'next/link'
import { ArrowUpRight, ChevronDown, FolderTree } from 'lucide-react'
import CategoryActions from './CategoryActions'
import { titleCase, normalizeSearch } from '@/lib/format'
import { categoryHierarchy } from '@/lib/categories'
import { cn } from '@/lib/classes'

function CategoryNode({ category, admin, onRemove, root = false, className }) {
  const name = titleCase(category.name)
  return (
    <div className={className}>
      <div className="flex items-center gap-2.5 min-w-0 max-[520px]:gap-1.5">
        {root && (
          <span className="grid place-items-center shrink-0 w-11.25 h-11.25 rounded-xl text-brand-accent bg-brand-accent-soft max-[520px]:hidden">
            <FolderTree size={23} aria-hidden="true" />
          </span>
        )}
        <Link
          className={cn(
            'flex min-h-11 min-w-0 flex-1 items-center gap-2 text-ui font-semibold hover:text-brand-accent',
            root && 'text-[18px] font-extrabold max-[520px]:text-body'
          )}
          href={`/products?categoryId=${category.id}`}
        >
          <span className="wrap-anywhere">{name}</span>
          <ArrowUpRight className="text-brand-accent shrink-0" size={16} aria-hidden="true" />
        </Link>
        {admin && <CategoryActions category={category} onRemove={onRemove} />}
      </div>
      {category.children.length > 0 && (
        <details className="mt-3">
          <summary className="flex items-center gap-2.25 min-h-11 rounded-lg py-2.5 px-3 text-[#4d296e] bg-[#f4edfc] font-bold text-small cursor-pointer list-none [&::-webkit-details-marker]:hidden focus-visible:outline-solid focus-visible:outline-3 focus-visible:outline-brand-accent focus-visible:outline-offset-3">
            <ChevronDown
              className="[details[open]>summary>&]:rotate-180"
              size={17}
              aria-hidden="true"
            />
            <span>
              {category.children.length}{' '}
              {category.children.length === 1 ? 'Subcategoria' : 'Subcategorias'}
            </span>
          </summary>
          <div className="pl-3.25 border-l-2 border-l-[#d8c1ed] mt-3.75 mr-0 mb-0 ml-2 grid gap-2.25 max-[520px]:pl-2.25 max-[520px]:ml-0.5">
            {category.children.map((child) => (
              <CategoryNode key={child.id} category={child} admin={admin} onRemove={onRemove} />
            ))}
          </div>
        </details>
      )}
    </div>
  )
}
export default function CategoryTree({ categories, admin, onRemove, search }) {
  const categoriesById = new Map(categories.map((category) => [category.id, category]))
  const normalizedSearch = normalizeSearch(search)
  const visible = search
    ? categories
        .filter((category) => normalizeSearch(category.name).includes(normalizedSearch))
        .map((category) => ({ ...category, children: [] }))
    : categoryHierarchy(categories)
  return (
    <div className="grid grid-cols-1 gap-4.5 items-start">
      {visible.map((category) => (
        <section
          className="relative border border-[#d6c5e6] rounded-[15px] bg-white p-5.5 shadow-panel border-t-3 border-t-brand-accent min-w-0 max-[520px]:p-4"
          key={category.id}
        >
          {search && category.category && (
            <p className="text-brand-muted text-small mb-2.5">
              {titleCase(categoriesById.get(category.category)?.name || 'Categoria')}
            </p>
          )}
          {category.children.length ? (
            <>
              {admin && (
                <div className="absolute top-5.5 right-5.5 z-2 max-[520px]:top-4 max-[520px]:right-4">
                  <CategoryActions category={category} onRemove={onRemove} />
                </div>
              )}
              <details>
                <summary
                  className={cn(
                    'flex min-h-12.5 cursor-pointer list-none items-center gap-3.75 rounded-lg focus-visible:outline-solid focus-visible:outline-3 focus-visible:outline-brand-accent focus-visible:outline-offset-[5px] [&::-webkit-details-marker]:hidden',
                    admin && 'mr-15'
                  )}
                >
                  <span className="grid place-items-center shrink-0 w-11.25 h-11.25 rounded-xl text-brand-accent bg-brand-accent-soft max-[520px]:hidden">
                    <FolderTree size={23} aria-hidden="true" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <strong className="block text-[18px] font-extrabold wrap-break-word max-[520px]:text-[16px]">
                      {titleCase(category.name)}
                    </strong>
                    <small className="block text-brand-muted text-small mt-1.25">
                      {category.children.length}{' '}
                      {category.children.length === 1 ? 'Subcategoria' : 'Subcategorias'}
                    </small>
                  </span>
                  <ChevronDown
                    className="shrink-0 text-brand-accent [details[open]>summary>&]:rotate-180"
                    size={20}
                    aria-hidden="true"
                  />
                </summary>
                <div className="border-t border-t-brand-border pt-4 mt-5">
                  <Link
                    className="inline-flex max-w-full items-center gap-2.25 text-[#5a2789] text-small font-bold min-h-11 mb-2.5 hover:underline"
                    href={`/products?categoryId=${category.id}`}
                  >
                    <span className="min-w-0 wrap-anywhere">
                      Ver Produtos de {titleCase(category.name)}
                    </span>
                    <ArrowUpRight className="shrink-0" size={16} aria-hidden="true" />
                  </Link>
                  <div className="grid gap-2.25">
                    {category.children.map((child) => (
                      <CategoryNode
                        className="rounded-[10px] border border-brand-border bg-[#fcfaff] px-4 py-3 max-[520px]:p-2.5"
                        key={child.id}
                        category={child}
                        admin={admin}
                        onRemove={onRemove}
                      />
                    ))}
                  </div>
                </div>
              </details>
            </>
          ) : (
            <CategoryNode category={category} admin={admin} onRemove={onRemove} root />
          )}
        </section>
      ))}
    </div>
  )
}
