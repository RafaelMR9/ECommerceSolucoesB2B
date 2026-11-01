import { useState } from 'react'
import { useRouter } from 'next/router'
import BaseLayout from '@/components/shared/BaseLayout'
import PageHeader from '@/components/ui/PageHeader'
import DataTable, { TableHeader, TableRow, TableCell } from '@/components/ui/DataTable'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import Modal from '@/components/shared/Modal'
import { reviewCredit } from '@/services/userService'
import { withSession } from '@/lib/server/page'
import { errorMessage } from '@/lib/format'
export default function Analysis({ companies }) {
  const router = useRouter()
  const [selected, setSelected] = useState(null)
  const [error, setError] = useState('')
  async function confirm() {
    try {
      await reviewCredit(selected.company.id, selected.approved)
      await router.replace(router.asPath)
      setSelected(null)
    } catch (e) {
      setError(errorMessage(e))
    }
  }
  return (
    <BaseLayout>
      <PageHeader
        title="Análise de Crédito"
        eyebrow="Administração"
        description="Avalie as solicitações de compras faturadas das organizações."
      />
      <DataTable
        empty={!companies.length}
        emptyMessage="Nenhuma solicitação aguardando análise"
        label="Solicitações de Crédito"
      >
        <thead className="bg-[#3c2456]">
          <tr>
            <TableHeader>Organização</TableHeader>
            <TableHeader>CNPJ</TableHeader>
            <TableHeader>Ações</TableHeader>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <TableRow key={company.id}>
              <TableCell>{company.name}</TableCell>
              <TableCell>{company.cnpj}</TableCell>
              <TableCell>
                <div className="flex gap-1.75 flex-wrap min-w-40">
                  <Button
                    size="small"
                    className="whitespace-nowrap"
                    onClick={() => {
                      setSelected({ company, approved: true })
                      setError('')
                    }}
                  >
                    Autorizar
                  </Button>
                  <Button
                    size="small"
                    variant="danger"
                    className="whitespace-nowrap"
                    onClick={() => {
                      setSelected({ company, approved: false })
                      setError('')
                    }}
                  >
                    Não Autorizar
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </DataTable>
      <Modal
        isOpen={Boolean(selected)}
        title="Confirmar Análise"
        message={`${selected?.approved ? 'Autorizar' : 'Não autorizar'} compras faturadas para ${selected?.company.name}?`}
        confirm={selected?.approved}
        option1="Confirmar"
        option2="Voltar"
        onClose={() => setSelected(null)}
        onConfirm={confirm}
      >
        <Alert>{error}</Alert>
      </Modal>
    </BaseLayout>
  )
}
export const getServerSideProps = withSession(
  async ({ api }) => ({
    companies: (await api('users/')).filter((u) => !u.is_superuser && u.authorizeFature === false),
  }),
  { admin: true }
)
