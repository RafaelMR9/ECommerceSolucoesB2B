import { money } from '@/lib/format'

export default function OrderSummary({
  title = 'Resumo do Pedido',
  description,
  label = 'Total',
  total,
  children,
}) {
  return (
    <aside className="min-w-0 rounded-panel border border-brand-border bg-brand-surface p-[25px] shadow-panel max-[640px]:p-5">
      <h2 className="mb-4.5 text-[18px] font-bold">{title}</h2>
      <p className="text-small text-brand-muted">{description}</p>
      <div className="my-[23px] flex flex-wrap items-center justify-between gap-5 text-ui">
        <span>{label}</span>
        <strong className="text-[27px] font-extrabold text-brand-accent [overflow-wrap:anywhere]">
          {money(total)}
        </strong>
      </div>
      {children}
    </aside>
  )
}
