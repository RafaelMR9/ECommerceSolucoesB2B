import Spinner from '@/components/ui/Spinner'
import { useNavigationLoading } from '@/contexts/navigationContext'

export default function ResultsLoading() {
  const loading = useNavigationLoading() === 'results'
  return (
    <span
      className="inline-flex min-h-6 items-center gap-2 text-small text-brand-muted"
      role="status"
    >
      {loading && (
        <>
          <Spinner className="text-brand-accent" />
          Atualizando resultados…
        </>
      )}
    </span>
  )
}
