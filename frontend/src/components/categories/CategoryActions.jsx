import { useRef } from 'react'
import { Ellipsis, Pencil, Trash2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import { titleCase } from '@/lib/format'

export default function CategoryActions({ category, onRemove }) {
  const menu = useRef(null)
  const name = titleCase(category.name)
  function close() {
    if (menu.current) {
      menu.current.open = false
      menu.current.querySelector('summary')?.focus()
    }
  }
  return (
    <details
      className="category-actions-menu"
      ref={menu}
      onKeyDown={(event) => {
        if (event.key === 'Escape') close()
      }}
    >
      <summary aria-label={`Gerenciar ${name}`} title={`Gerenciar ${name}`}>
        <Ellipsis size={20} aria-hidden="true" />
      </summary>
      <div className="category-action-menu-items">
        <Button
          href={`/categories/update?categoryId=${category.id}`}
          variant="ghost"
          aria-label={`Editar ${name}`}
          onClick={close}
        >
          <Pencil size={16} aria-hidden="true" />
          Editar Categoria
        </Button>
        <Button
          variant="danger"
          aria-label={`Remover ${name}`}
          onClick={() => {
            close()
            onRemove(category)
          }}
        >
          <Trash2 size={16} aria-hidden="true" />
          Remover Categoria
        </Button>
      </div>
    </details>
  )
}
