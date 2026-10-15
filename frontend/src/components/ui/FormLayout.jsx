import { Check, FileText } from 'lucide-react'

export default function FormLayout({
  children,
  icon: Icon = FileText,
  title,
  description,
  points = [],
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_310px] gap-6.5 items-start max-[950px]:grid-cols-1">
      <div className="min-w-0">{children}</div>
      <aside className="rounded-[18px] p-7 bg-guide bg-[#21132d] text-[#e4d9ef] overflow-hidden max-[640px]:p-5.75">
        <span className="grid place-items-center w-15 h-15 bg-[#ffffff14] border border-[#9778b4] rounded-[17px] text-[#d1adff] mb-6.5">
          <Icon size={28} aria-hidden="true" />
        </span>
        <p className="text-caption font-extrabold tracking-[1.2px] mb-2.5 text-[#d1adff]">
          Para Sua Organização
        </p>
        <h2 className="text-[25px] leading-tight tracking-[-0.6px] font-extrabold text-white mb-3.75">
          {title}
        </h2>
        <p className="text-ui leading-[1.8]">{description}</p>
        <ul className="border-t border-t-[#694881] mt-6.25 pt-6.25 grid gap-5.5 max-[950px]:grid-cols-3 max-[640px]:grid-cols-1 max-[640px]:gap-4">
          {points.map(({ title: pointTitle, text }) => (
            <li className="flex gap-2.75 items-start" key={pointTitle}>
              <Check className="shrink-0 mt-0.75 text-[#d1adff]" size={17} aria-hidden="true" />
              <div>
                <h3 className="text-white text-ui font-bold">{pointTitle}</h3>
                <p className="text-[#d4c4e0] text-small leading-[1.7] mt-1">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  )
}
