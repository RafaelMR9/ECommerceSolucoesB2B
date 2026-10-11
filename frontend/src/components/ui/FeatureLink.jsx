import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
export default function FeatureLink({ href, title, description, icon: Icon }) {
  return (
    <Link className="option-card" href={href}>
      {Icon && <Icon size={25} aria-hidden="true" />}
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <ArrowUpRight size={17} className="option-arrow" aria-hidden="true" />
    </Link>
  )
}
