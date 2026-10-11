import Link from 'next/link'
import Button from '@/components/ui/Button'

function CategoryNode({ category, categories, admin, onRemove, ancestry = [] }) {
  const children = categories.filter((c) => c.category === category.id && !ancestry.includes(c.id))
  return (
    <>
      <div className="category-row">
        <Link href={`/products?categoryId=${category.id}`}>{category.name}</Link>
        {admin && (
          <div className="category-controls">
            <Button href={`/categories/update?categoryId=${category.id}`} variant="ghost">
              Editar
            </Button>
            <Button variant="danger" onClick={() => onRemove(category)}>
              Remover
            </Button>
          </div>
        )}
      </div>
      {children.length > 0 && (
        <div className="category-children">
          {children.map((c) => (
            <CategoryNode
              key={c.id}
              category={c}
              categories={categories}
              admin={admin}
              onRemove={onRemove}
              ancestry={[...ancestry, category.id]}
            />
          ))}
        </div>
      )}
    </>
  )
}
export default function CategoryTree({ categories, admin, onRemove, search }) {
  const visible = search
    ? categories.filter((c) =>
        c.name.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR'))
      )
    : categories.filter(
        (c) => c.category === null || !categories.some((parent) => parent.id === c.category)
      )
  return (
    <div className="category-tree">
      {visible.map((category) => (
        <section className="category-branch" key={category.id}>
          <CategoryNode
            category={category}
            categories={search ? [] : categories}
            admin={admin}
            onRemove={onRemove}
          />
        </section>
      ))}
    </div>
  )
}
