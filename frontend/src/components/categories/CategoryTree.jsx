import Link from 'next/link'
import { ArrowUpRight, ChevronDown, FolderTree } from 'lucide-react'
import CategoryActions from './CategoryActions'
import { titleCase } from '@/lib/format'
import { categoryHierarchy, categorySearchText } from '@/lib/categories'

function CategoryNode({ category, admin, onRemove, root = false }) {
  const name = titleCase(category.name)
  return (
    <div className={root ? 'category-node category-node-root' : 'category-node'}>
      <div className="category-node-row">
        {root && (
          <span className="category-node-icon">
            <FolderTree size={23} aria-hidden="true" />
          </span>
        )}
        <Link className="category-node-link" href={`/products?categoryId=${category.id}`}>
          <span>{name}</span>
          <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
        {admin && <CategoryActions category={category} onRemove={onRemove} />}
      </div>
      {category.children.length > 0 && (
        <details className="category-disclosure">
          <summary>
            <ChevronDown size={17} aria-hidden="true" />
            <span>
              {category.children.length}{' '}
              {category.children.length === 1 ? 'Subcategoria' : 'Subcategorias'}
            </span>
          </summary>
          <div className="category-descendants">
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
  const visible = search
    ? categories
        .filter((category) =>
          categorySearchText(category.name).includes(categorySearchText(search))
        )
        .map((category) => ({ ...category, children: [] }))
    : categoryHierarchy(categories)
  return (
    <div className="category-tree">
      {visible.map((category) => (
        <section className="category-branch" key={category.id}>
          {search && category.category && (
            <p className="category-parent">
              {titleCase(
                categories.find((parent) => parent.id === category.category)?.name || 'Categoria'
              )}
            </p>
          )}
          {category.children.length ? (
            <>
              {admin && (
                <div className="category-root-actions">
                  <CategoryActions category={category} onRemove={onRemove} />
                </div>
              )}
              <details className={`category-root-disclosure ${admin ? 'has-actions' : ''}`}>
                <summary>
                  <span className="category-node-icon">
                    <FolderTree size={23} aria-hidden="true" />
                  </span>
                  <span className="category-group-copy">
                    <strong>{titleCase(category.name)}</strong>
                    <small>
                      {category.children.length}{' '}
                      {category.children.length === 1 ? 'Subcategoria' : 'Subcategorias'}
                    </small>
                  </span>
                  <ChevronDown size={20} aria-hidden="true" />
                </summary>
                <div className="category-root-content">
                  <Link
                    className="category-group-catalog"
                    href={`/products?categoryId=${category.id}`}
                  >
                    Ver Produtos de {titleCase(category.name)}
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </Link>
                  <div className="category-descendants">
                    {category.children.map((child) => (
                      <CategoryNode
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
