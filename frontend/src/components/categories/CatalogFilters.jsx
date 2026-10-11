import Link from 'next/link'
import { useId, useState } from 'react'
import { ChevronDown, LayoutGrid, Search, SlidersHorizontal } from 'lucide-react'
import { titleCase } from '@/lib/format'
import { categorySearchText } from '@/lib/categories'

export default function CatalogFilters({ categories, categoryId }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const contentId = useId()
  const selected = categories.find((category) => String(category.id) === categoryId)
  const visible = categories.filter((category) =>
    categorySearchText(category.name).includes(categorySearchText(search))
  )
  return (
    <aside className="catalog-sidebar">
      <button
        type="button"
        className="catalog-filter-toggle"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen(!open)}
      >
        <SlidersHorizontal size={19} aria-hidden="true" />
        <span>
          Filtrar por Categoria
          <small>{selected ? titleCase(selected.name) : 'Todos os Produtos'}</small>
        </span>
        <ChevronDown size={18} aria-hidden="true" />
      </button>
      <div className={`catalog-filter-content ${open ? 'is-open' : ''}`} id={contentId}>
        <div className="catalog-filter-heading">
          <h2>Categorias</h2>
          <span>{categories.length}</span>
        </div>
        <Link
          className="catalog-all"
          href="/products"
          aria-current={!categoryId ? 'page' : undefined}
        >
          <LayoutGrid size={17} aria-hidden="true" />
          Todos os Produtos
        </Link>
        <label className="catalog-category-search">
          <Search size={17} aria-hidden="true" />
          <span className="sr-only">Buscar nas Categorias</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar Categoria"
          />
        </label>
        <nav className="catalog-category-list" aria-label="Filtrar por Categoria" tabIndex={0}>
          {visible.map((category) => (
            <Link
              className={category.category ? 'is-subcategory' : ''}
              key={category.id}
              href={`/products?categoryId=${category.id}`}
              aria-current={String(category.id) === categoryId ? 'page' : undefined}
              onClick={() => setOpen(false)}
            >
              {titleCase(category.name)}
            </Link>
          ))}
          {!visible.length && <p>Nenhuma categoria encontrada.</p>}
        </nav>
      </div>
    </aside>
  )
}
