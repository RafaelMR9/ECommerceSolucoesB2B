import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/classes'

export default function DeveloperCredit({ inverse = false }) {
  return (
    <p className="text-caption">
      Desenvolvido por{' '}
      <a
        className={cn(
          'inline-flex min-h-8 items-center gap-0.75 rounded-sm underline underline-offset-4 transition-colors',
          inverse
            ? 'text-[#d6b5ff] hover:text-white focus-visible:outline-brand-focus-light'
            : 'text-brand-accent hover:text-brand-accent-hover'
        )}
        href="https://rafael-dev.vercel.app/"
      >
        Rafael Ribeiro <ArrowUpRight size={13} aria-hidden="true" />
      </a>
    </p>
  )
}
