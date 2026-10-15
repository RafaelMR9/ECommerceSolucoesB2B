import { useState } from 'react'
import { useRouter } from 'next/router'
import Button from '@/components/ui/Button'
import PageHeader from '@/components/ui/PageHeader'
import Modal from '@/components/shared/Modal'
import Alert from '@/components/ui/Alert'
import DetailItem from '@/components/ui/DetailItem'
import { removeSupplier } from '@/services/supplierService'
import { removeCarrier } from '@/services/carrierService'
import { errorFields } from '@/lib/format'

export default function PartnerDetails({ kind, partner, children }) {
  const router = useRouter()
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
              {kind === 'suppliers' ? 'Remover Fornecedor' : 'Remover Transportadora'}
            </Button>
          </>
        }
      />
      <Alert>{error}</Alert>
      <div className="bg-brand-surface border border-brand-border rounded-panel p-6.25 shadow-panel max-[640px]:p-5 mb-8">
        <dl className="grid grid-cols-2 gap-5.5 max-[600px]:grid-cols-1">
          {[
            ['Nome', partner.name],
            ['CNPJ', partner.cnpj],
            ['E-mail', partner.email],
          ].map(([label, value]) => (
            <DetailItem key={label} label={label}>
              {value || '—'}
            </DetailItem>
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
