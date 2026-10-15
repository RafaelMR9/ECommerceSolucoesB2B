import EmptyState from './EmptyState'
import { cn } from '@/lib/classes'
export default function DataTable({ children, empty, emptyMessage, label = 'Dados' }) {
  if (empty) return <EmptyState title={emptyMessage || 'Nenhum Registro Encontrado'} />
  return (
    <div
      className="min-w-0 w-full overflow-x-auto rounded-panel border border-brand-border bg-brand-surface shadow-panel max-[640px]:rounded-[10px]"
      role="region"
      aria-label={label}
      tabIndex={0}
    >
      <table className="w-full min-w-140 border-collapse text-left text-ui">{children}</table>
    </div>
  )
}
export function TableHeader({ className, children, ...props }) {
  return (
    <th
      scope="col"
      className={cn(
        'whitespace-nowrap border-b border-[#62447e] px-4.75 py-4 text-small font-bold text-white',
        className
      )}
      {...props}
    >
      {children}
    </th>
  )
}
export function TableCell({ className, children, ...props }) {
  return (
    <td
      className={cn(
        'border-b border-[#efebf3] px-4.75 py-4.5 align-middle text-small text-brand-ink wrap-anywhere group-last/row:border-b-0',
        className
      )}
      {...props}
    >
      {children}
    </td>
  )
}
export function TableRow({ className, children, ...props }) {
  return (
    <tr className={cn('group/row even:bg-[#faf7fd] hover:bg-[#fcfaff]', className)} {...props}>
      {children}
    </tr>
  )
}
