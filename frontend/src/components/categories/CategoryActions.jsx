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
      className="relative shrink-0"
      ref={menu}
      onKeyDown={(event) => {
        if (event.key === 'Escape') close()
      }}
    >
      <summary
        className="grid place-items-center w-11 h-11 border border-brand-border rounded-lg text-[#573479] bg-white cursor-pointer list-none [&::-webkit-details-marker]:hidden hover:bg-brand-accent-soft hover:border-[#bfa0df] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-brand-accent focus-visible:outline-offset-3"
        aria-label={`Gerenciar ${name}`}
        title={`Gerenciar ${name}`}
      >
        <Ellipsis size={20} aria-hidden="true" />
      </summary>
      <div className="absolute right-0 top-[calc(100%_+_6px)] w-[210px] p-2 grid gap-1.5 border border-brand-border rounded-[10px] bg-white shadow-[0_12px_32px_#28113729] z-[20]">
        <Button
          className="justify-start text-small"
          href={`/categories/update?categoryId=${category.id}`}
          variant="ghost"
          aria-label={`Editar ${name}`}
          onClick={close}
        >
          <Pencil className="shrink-0" size={16} aria-hidden="true" />
          Editar Categoria
        </Button>
        <Button
          className="justify-start text-small"
          variant="danger"
          aria-label={`Remover ${name}`}
          onClick={() => {
            close()
            onRemove(category)
          }}
        >
          <Trash2 className="shrink-0" size={16} aria-hidden="true" />
          Remover Categoria
        </Button>
      </div>
    </details>
  )
}
