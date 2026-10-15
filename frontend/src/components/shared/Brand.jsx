import Link from 'next/link'
import { Boxes } from 'lucide-react'
import { cn } from '@/lib/classes'
export default function Brand({ compact = false, className, small = false }) {
  return (
    <Link
      className={cn(
        'inline-flex items-center gap-2.25 whitespace-nowrap text-[21px] font-extrabold tracking-[-0.8px] text-white focus-visible:outline-brand-focus-light max-[600px]:text-[18px]',
        small && 'max-[360px]:gap-1 max-[360px]:text-[16px]',
        className
      )}
      href="/"
      aria-label="B2B Soluções — Início"
    >
      {!compact && (
        <span
          className={cn(
            'grid h-8.75 w-8.75 place-items-center rounded-[10px] bg-brand-accent text-white',
            small && 'max-[360px]:h-7 max-[360px]:w-7'
          )}
        >
          <Boxes size={21} aria-hidden="true" />
        </span>
      )}
      <span>
        B2B <span className="font-medium text-[#ba97f4]">Soluções</span>
      </span>
    </Link>
  )
}
