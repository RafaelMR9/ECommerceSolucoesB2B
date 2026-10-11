import Link from 'next/link'
import { Keyboard, Headphones, NotebookPen, Package } from 'lucide-react'
function categoryIcon(name) {
  if (/inform|comput|teclad/i.test(name)) return Keyboard
  if (/áudio|audio|fone/i.test(name)) return Headphones
  if (/papel|cadern|escrit/i.test(name)) return NotebookPen
  return Package
}
export default function CategoryCard({ category }) {
  const Icon = categoryIcon(category.name)
  return (
    <Link className="category-card" href={`/products?categoryId=${category.id}`}>
      <span className="category-icon">
        <Icon size={21} aria-hidden="true" />
      </span>
      <div>
        <h3>{category.name}</h3>
        <p>Explorar produtos</p>
      </div>
    </Link>
  )
}
