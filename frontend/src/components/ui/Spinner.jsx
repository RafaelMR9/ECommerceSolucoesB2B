import { LoaderCircle } from 'lucide-react'
import { cn } from '@/lib/classes'

export default function Spinner({ className = '' }) {
  return (
    <LoaderCircle
      aria-hidden="true"
      className={cn('size-5 animate-spin motion-reduce:animate-none', className)}
    />
  )
}
