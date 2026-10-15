import { cn } from '@/lib/classes'

export default function Container({ children, className, ...props }) {
  return (
    <div
      className={cn('mx-auto max-w-310 px-8 max-[600px]:px-5 max-[360px]:px-4', className)}
      {...props}
    >
      {children}
    </div>
  )
}
