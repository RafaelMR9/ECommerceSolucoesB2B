import Input from '@/components/ui/Input'
import FeatureLink from '@/components/ui/FeatureLink'
import { Building2, Truck } from 'lucide-react'
import Button from '@/components/ui/Button'
import PageHeader from '@/components/ui/PageHeader'
import EmptyState from '@/components/ui/EmptyState'

export default function PartnerList({ kind, partners, search }) {
  const suppliers = kind === 'suppliers',
    title = suppliers ? 'Fornecedores' : 'Transportadoras',
    Icon = suppliers ? Building2 : Truck
  return (
    <>
      <PageHeader
        title={title}
        description={
          suppliers
            ? 'Parceiros que abastecem o catálogo da sua empresa.'
            : 'Parceiros responsáveis pelo transporte dos pedidos.'
        }
        eyebrow="Administração"
        actions={
          <Button href={`/${kind}/register`}>
            {suppliers ? 'Cadastrar Fornecedor' : 'Cadastrar Transportadora'}
          </Button>
        }
      />
      <form className="flex flex-wrap gap-2 items-center min-w-0 mb-6" action={`/${kind}`}>
        <Input
          className="duration-150 min-w-0 flex-[1_1_180px] max-w-md"
          type="search"
          name="search"
          defaultValue={search}
          aria-label={`Buscar ${title}`}
          placeholder={`Buscar ${title}`}
        />
        <Button type="submit" variant="secondary">
          Pesquisar
        </Button>
        {search && (
          <Button href={`/${kind}`} variant="ghost">
            Limpar Busca
          </Button>
        )}
      </form>
      {partners.length ? (
        <div className="grid grid-cols-2 gap-4.5 max-[640px]:grid-cols-1">
          {partners.map((partner) => (
            <FeatureLink
              href={`/${kind}/${partner.id}`}
              key={partner.id}
              icon={Icon}
              title={partner.name}
            >
              <p className="mt-[7px] text-ui text-brand-muted [overflow-wrap:anywhere]">
                {partner.cnpj}
              </p>
              <p className="mt-[7px] text-ui text-brand-muted [overflow-wrap:anywhere]">
                {partner.email}
              </p>
            </FeatureLink>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Nenhum Parceiro Encontrado"
          description="Tente outra busca ou cadastre um novo parceiro."
        />
      )}
    </>
  )
}
