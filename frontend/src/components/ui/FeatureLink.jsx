import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
export default function FeatureLink({ href, title, description, icon: Icon }) {
  return (
    <Link
      className="min-w-0 bg-white border border-brand-border border-t-3 border-t-[#af8fce] rounded-panel p-6 flex gap-[17px] items-start transition-colors duration-150 hover:border-brand-accent hover:bg-[#f8f1ff]"
      href={href}
    >
      {Icon && <Icon className="text-brand-accent shrink-0" size={25} aria-hidden="true" />}
      <div className="min-w-0 flex-1">
        <h2 className="font-bold text-[18px] tracking-[-0.5px]">{title}</h2>
        <p className="[overflow-wrap:anywhere] text-ui text-brand-muted mt-[7px]">{description}</p>
      </div>
      <ArrowUpRight size={17} className="text-brand-accent shrink-0 ml-auto" aria-hidden="true" />
    </Link>
  )
}
