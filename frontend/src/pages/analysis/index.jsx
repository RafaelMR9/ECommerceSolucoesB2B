import { TableHeader, TableRow, TableCell } from '@/components/ui/DataTable'
import { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import BaseLayout from '@/components/shared/BaseLayout'
import PageHeader from '@/components/ui/PageHeader'
import DataTable from '@/components/ui/DataTable'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import Modal from '@/components/shared/Modal'
import { AuthContext } from '@/contexts/authContext'
import { updateUser } from '@/services/userService'
import { registerTicket } from '@/services/supportService'
import { withSession } from '@/lib/server/page'
import { errorFields } from '@/lib/format'
export default function Analysis({ companies }) {
  const { user } = useContext(AuthContext),
    router = useRouter(),
    [selected, setSelected] = useState(null),
    [error, setError] = useState('')
  async function confirm() {
    try {
      await updateUser(
        { authorizeFature: selected.approved ? true : null },
        selected.company.id,
        selected.company.username
      )
      await registerTicket({
        sender: user.id,
        recipient: selected.company.id,
        subject: `${selected.company.name}: Resultado da análise de crédito`,
        content: selected.approved
          ? 'Sua organização está autorizada a realizar compras faturadas.'
          : 'Sua solicitação de compras faturadas não foi aprovada neste momento.',
        answer: null,
      })
      setSelected(null)
      await router.replace(router.asPath)
    } catch (e) {
      setError(Object.values(errorFields(e)).join(' '))
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
                <div className="flex gap-[7px] flex-wrap min-w-[160px]">
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
