import Link from 'next/link'
import { useId, useState } from 'react'
import { ChevronDown, LayoutGrid, Search, SlidersHorizontal } from 'lucide-react'
import { titleCase, normalizeSearch } from '@/lib/format'
import { cn } from '@/lib/classes'

export default function CatalogFilters({ categories, categoryId }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const contentId = useId()
  const selected = categories.find((category) => String(category.id) === categoryId)
  const normalizedSearch = normalizeSearch(search)
  const visible = categories.filter((category) =>
    normalizeSearch(category.name).includes(normalizedSearch)
  )
  return (
    <aside className="border border-[#d6c5e6] rounded-panel bg-white p-4.5 self-start min-w-0 shadow-panel max-[760px]:p-0">
      <button
        type="button"
        className="hidden max-[760px]:flex max-[760px]:items-center max-[760px]:gap-3 max-[760px]:w-full max-[760px]:p-4 max-[760px]:text-[#4d296e] max-[760px]:text-left max-[760px]:min-h-16 max-[760px]:text-ui max-[760px]:font-bold"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen(!open)}
      >
        <SlidersHorizontal className="shrink-0" size={19} aria-hidden="true" />
        <span className="max-[760px]:flex-1 max-[760px]:min-w-0">
          Filtrar por Categoria
          <small className="max-[760px]:block max-[760px]:text-small max-[760px]:text-brand-muted max-[760px]:mt-1 max-[760px]:font-normal">
            {selected ? titleCase(selected.name) : 'Todos os Produtos'}
          </small>
        </span>
        <ChevronDown
          className={cn('shrink-0', open && 'rotate-180')}
          size={18}
          aria-hidden="true"
        />
      </button>
      <div
        className={cn(
          'max-[760px]:border-t max-[760px]:border-brand-border max-[760px]:p-4',
          open ? 'max-[760px]:block' : 'max-[760px]:hidden'
        )}
        id={contentId}
      >
        <div className="flex justify-between items-center mb-4.25">
          <h2 className="text-[18px] font-extrabold">Categorias</h2>
          <span className="text-caption font-bold bg-brand-accent-soft text-[#54267c] py-1 px-2.25 rounded-[7px]">
            {categories.length}
          </span>
        </div>
        <Link
          className="flex gap-2.25 items-center p-3 rounded-lg bg-[#f4edfc] text-[#4d296e] text-small font-bold min-h-11 aria-[current=page]:bg-brand-accent aria-[current=page]:text-white hover:bg-brand-accent hover:text-white"
          onClick={() => setOpen(false)}
          href="/products"
          aria-current={!categoryId ? 'page' : undefined}
        >
          <LayoutGrid size={17} aria-hidden="true" />
          Todos os Produtos
        </Link>
        <label className="flex items-center gap-1.75 p-2.5 border border-[#cdbedc] rounded-lg text-brand-muted my-3.25 mx-0 focus-within:outline-solid focus-within:outline-2 focus-within:outline-brand-accent focus-within:outline-offset-2">
          <Search className="shrink-0" size={17} aria-hidden="true" />
          <span className="sr-only">Buscar nas Categorias</span>
          <input
            className="min-w-0 w-full bg-white text-brand-ink text-[16px] focus:outline-hidden placeholder:text-brand-muted placeholder:opacity-[1]"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar Categoria"
          />
        </label>
        <nav
          className="grid gap-0.75 max-h-90 overflow-y-auto scrollbar-thin [scrollbar-color:#b99ed3_#f4edfc] overscroll-y-contain pr-1.25 max-[760px]:max-h-60"
          aria-label="Filtrar por Categoria"
          tabIndex={0}
        >
          {visible.map((category) => (
            <Link
              className={cn(
                'flex min-h-11 items-center rounded-[7px] p-2.5 text-small font-semibold text-brand-muted wrap-anywhere hover:bg-brand-accent-soft hover:text-[#4d296e] aria-[current=page]:border-l-3 aria-[current=page]:border-l-brand-accent aria-[current=page]:bg-brand-accent-soft aria-[current=page]:font-bold aria-[current=page]:text-[#4d296e]',
                category.category && 'border-l-2 border-[#e4d8ef] pl-5.5 font-normal'
              )}
              key={category.id}
              href={`/products?categoryId=${category.id}`}
              aria-current={String(category.id) === categoryId ? 'page' : undefined}
              onClick={() => setOpen(false)}
            >
              {titleCase(category.name)}
            </Link>
          ))}
          {!visible.length && (
            <p className="text-small text-brand-muted p-2.5">Nenhuma categoria encontrada.</p>
          )}
        </nav>
      </div>
    </aside>
  )
}
