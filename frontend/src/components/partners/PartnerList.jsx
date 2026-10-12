import Input from '@/components/ui/Input'
import Link from 'next/link'
import { Building2, Truck, ArrowUpRight } from 'lucide-react'
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
            <Link
              className="min-w-0 bg-white border border-brand-border border-t-3 border-t-[#af8fce] rounded-panel p-6 flex gap-[17px] items-start transition-colors duration-150 hover:border-brand-accent hover:bg-[#f8f1ff]"
              href={`/${kind}/${partner.id}`}
              key={partner.id}
            >
              <Icon className="text-brand-accent shrink-0" size={25} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <h2 className="font-bold text-[18px] tracking-[-0.5px]">{partner.name}</h2>
                <p className="[overflow-wrap:anywhere] text-ui text-brand-muted mt-[7px]">
                  {partner.cnpj}
                </p>
                <p className="[overflow-wrap:anywhere] text-ui text-brand-muted mt-[7px]">
                  {partner.email}
                </p>
              </div>
              <ArrowUpRight
                size={17}
                className="text-brand-accent shrink-0 ml-auto"
                aria-hidden="true"
              />
            </Link>
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
