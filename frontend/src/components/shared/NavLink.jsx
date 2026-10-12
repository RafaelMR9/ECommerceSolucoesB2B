import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/classes'

export default function NavLink({
  href,
  children,
  icon: Icon,
  active,
  administrative,
  onNavigate,
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-[7px] px-3 py-2 text-small font-semibold text-[#d5c7e5] transition-colors focus-visible:outline-brand-focus-light hover:bg-[#2b1c39] hover:text-white hover:underline hover:underline-offset-4 aria-[current=page]:bg-[#352046] aria-[current=page]:text-white',
        administrative
          ? 'max-[1100px]:min-h-12 max-[1100px]:gap-[9px] max-[1100px]:rounded-lg max-[1100px]:border max-[1100px]:border-[#40304e] max-[1100px]:bg-[#251b31] max-[1100px]:py-[9px] max-[1100px]:hover:bg-[#32223f] max-[1100px]:aria-[current=page]:border-[#8753b5] max-[1100px]:aria-[current=page]:bg-[#40265a]'
          : 'max-[1100px]:justify-center max-[1100px]:rounded-lg max-[1100px]:border max-[1100px]:border-[#382a46] max-[1100px]:p-2.5 max-[700px]:justify-start'
      )}
    >
      <Icon size={17} className="shrink-0 text-[#bfa0de]" aria-hidden="true" />
      <span className={administrative ? 'max-[1100px]:min-w-0 max-[1100px]:flex-1' : undefined}>
        {children}
      </span>
      {administrative && (
        <ChevronRight
          size={15}
          className="hidden shrink-0 text-[#b49acb] max-[1100px]:block"
          aria-hidden="true"
        />
      )}
    </Link>
  )
}
