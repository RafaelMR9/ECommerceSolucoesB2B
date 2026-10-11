import EmptyState from './EmptyState'
export default function DataTable({ children, empty, emptyMessage, label = 'Dados' }) {
  if (empty) return <EmptyState title={emptyMessage || 'Nenhum registro encontrado'} />
  return (
    <div className="table-container" role="region" aria-label={label} tabIndex={0}>
      <table className="data-table">{children}</table>
    </div>
  )
}
