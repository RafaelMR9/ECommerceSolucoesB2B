import Link from 'next/link'
import { Keyboard, Headphones, NotebookPen, Package } from 'lucide-react'
import { titleCase } from '@/lib/format'
function categoryIcon(name) {
  if (/inform|comput|teclad/i.test(name)) return Keyboard
  if (/áudio|audio|fone/i.test(name)) return Headphones
  if (/papel|cadern|escrit/i.test(name)) return NotebookPen
  return Package
}
export default function CategoryCard({ category }) {
  const Icon = categoryIcon(category.name)
  return (
    <Link
      className="flex min-w-0 items-center gap-3 bg-white border border-brand-border rounded-xl py-5 px-4 transition-colors duration-150 max-[520px]:py-[13px] max-[520px]:px-2.5 max-[520px]:gap-2 max-[360px]:flex-col max-[360px]:items-start hover:bg-brand-accent-soft hover:border-[#c6a8f1]"
      href={`/products?categoryId=${category.id}`}
    >
      <span className="text-brand-accent shrink-0 grid place-items-center bg-brand-accent-soft rounded-[10px] p-2.5 max-[520px]:p-[7px]">
        <Icon size={21} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <h3 className="text-ui font-bold [overflow-wrap:anywhere]">{titleCase(category.name)}</h3>
        <p className="text-caption text-brand-muted mt-[3px] max-[520px]:hidden">
          Explorar Produtos
        </p>
      </div>
    </Link>
  )
}
