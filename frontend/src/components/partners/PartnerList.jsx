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
      <form className="search-form mb-6" action={`/${kind}`}>
        <input
          className="field-control max-w-md"
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
        <div className="option-grid">
          {partners.map((partner) => (
            <Link className="option-card" href={`/${kind}/${partner.id}`} key={partner.id}>
              <Icon size={25} aria-hidden="true" />
              <div>
                <h2>{partner.name}</h2>
                <p>{partner.cnpj}</p>
                <p>{partner.email}</p>
              </div>
              <ArrowUpRight size={17} className="option-arrow" aria-hidden="true" />
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
