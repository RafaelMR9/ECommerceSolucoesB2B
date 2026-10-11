import Link from 'next/link'
import { Boxes } from 'lucide-react'
export default function Brand({ compact = false }) {
  return (
    <Link className="brand" href="/" aria-label="B2B Soluções — início">
      {!compact && (
        <span className="brand-mark">
          <Boxes size={21} aria-hidden="true" />
        </span>
      )}
      <span>
        B2B <span className="brand-accent">Soluções</span>
      </span>
    </Link>
  )
}
