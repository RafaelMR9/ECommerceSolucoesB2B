import Link from 'next/link'

export default function NavLink({ href, children, icon: Icon, active, onNavigate }) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className="inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-[7px] px-3 py-2 text-small font-semibold text-[#d5c7e5] transition-colors focus-visible:outline-brand-focus-light hover:bg-[#2b1c39] hover:text-white hover:underline hover:underline-offset-4 aria-[current=page]:bg-[#352046] aria-[current=page]:text-white max-[1100px]:min-h-12 max-[1100px]:gap-3 max-[1100px]:rounded-lg max-[1100px]:px-3.5 max-[1100px]:text-body"
    >
      <Icon size={17} className="shrink-0 text-[#bfa0de] max-[1100px]:size-5" aria-hidden="true" />
      <span>{children}</span>
    </Link>
  )
}
