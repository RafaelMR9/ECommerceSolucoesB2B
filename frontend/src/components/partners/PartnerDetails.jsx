import { useState } from 'react'
import { useRouter } from 'next/router'
import Button from '@/components/ui/Button'
import PageHeader from '@/components/ui/PageHeader'
import Modal from '@/components/shared/Modal'
import Alert from '@/components/ui/Alert'
import { removeSupplier } from '@/services/supplierService'
import { removeCarrier } from '@/services/carrierService'
import { errorFields } from '@/lib/format'

export default function PartnerDetails({ kind, partner, children }) {
  const router = useRouter(),
    singular = kind === 'suppliers' ? 'fornecedor' : 'transportadora'
  const [confirm, setConfirm] = useState(false),
    [error, setError] = useState('')
  async function remove() {
    try {
      await (kind === 'suppliers' ? removeSupplier : removeCarrier)(partner.id)
      await router.push(`/${kind}`)
    } catch (e) {
      const fields = errorFields(e)
      setError(Object.values(fields).filter(Boolean).join(' '))
    } finally {
      setConfirm(false)
    }
  }
  return (
    <>
      <PageHeader
        title={partner.name}
        eyebrow="Administração"
        back={{
          href: `/${kind}`,
          label: kind === 'suppliers' ? 'Fornecedores' : 'Transportadoras',
        }}
        actions={
          <>
            <Button
              href={`/${kind}/update?${kind === 'suppliers' ? 'supplierId' : 'carrierId'}=${partner.id}`}
              variant="secondary"
            >
              Editar Cadastro
            </Button>
            <Button variant="danger" onClick={() => setConfirm(true)}>
              Remover {singular}
            </Button>
          </>
        }
      />
      <Alert>{error}</Alert>
      <div className="panel mb-8">
        <dl className="profile-grid">
          {[
            ['Nome', partner.name],
            ['CNPJ', partner.cnpj],
            ['E-mail', partner.email],
          ].map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value || '—'}</dd>
            </div>
          ))}
        </dl>
      </div>
      {children}
      <Modal
        isOpen={confirm}
        title="Remover Cadastro"
        message={`Deseja remover ${partner.name}?`}
        option1="Remover"
        option2="Cancelar"
        onClose={() => setConfirm(false)}
        onConfirm={remove}
      />
    </>
  )
}
