export default function PurchaseLayout({ children, summary }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_340px] items-start gap-6.5 max-[1050px]:grid-cols-[minmax(0,1fr)_280px] max-[760px]:grid-cols-1">
      <div className="min-w-0">{children}</div>
      {summary}
    </div>
  )
}
