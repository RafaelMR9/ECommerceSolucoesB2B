import { TableHeader, TableRow, TableCell } from '@/components/ui/DataTable'
import { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import BaseLayout from '@/components/shared/BaseLayout'
import PageHeader from '@/components/ui/PageHeader'
import DataTable from '@/components/ui/DataTable'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import { AuthContext } from '@/contexts/authContext'
import { removeCartItem } from '@/services/checkoutService'
import { money, errorFields } from '@/lib/format'
import { withSession } from '@/lib/server/page'
import { loadCart } from '@/lib/server/orderLoaders'
export default function Cart({ items, products }) {
  const { user, cartCount } = useContext(AuthContext),
    router = useRouter(),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(null)
  const value = (item) => Number(user.is_superuser ? item.costPrice : item.salePrice),
    total = items.reduce((sum, item) => sum + value(item), 0)
  async function remove(item) {
    if (busy) return
    setBusy(item.id)
    setError('')
    try {
      await removeCartItem(item.id)
      await router.replace(router.asPath)
    } catch (e) {
      setError(Object.values(errorFields(e)).join(' '))
    } finally {
      setBusy(null)
    }
  }
  return (
    <BaseLayout>
      <PageHeader
        title={user.is_superuser ? 'Carrinho de Reposição' : 'Meu Carrinho'}
        description="Revise os produtos e as quantidades antes de finalizar."
        actions={
          <Button href={user.is_superuser ? '/restock' : '/products'} variant="secondary">
            Continuar Comprando
          </Button>
        }
      />
      <Alert>{error}</Alert>
      <div className="grid grid-cols-[minmax(0,_1fr)_340px] gap-[26px] items-start max-[1050px]:grid-cols-[minmax(0,_1fr)_280px] max-[760px]:grid-cols-1">
        <DataTable
          empty={!items.length}
          emptyMessage="Seu carrinho está vazio"
          label="Produtos do Carrinho"
        >
          <thead className="bg-[#3c2456]">
            <tr>
              <TableHeader>Produto</TableHeader>
              <TableHeader>Preço por Embalagem</TableHeader>
              <TableHeader>Quantidade</TableHeader>
              <TableHeader>Total</TableHeader>
              <TableHeader>Ação</TableHeader>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const product = products.find((p) => p.id === item.product)
              return (
                <TableRow key={item.id}>
                  <TableCell>{product?.name || 'Produto indisponível'}</TableCell>
                  <TableCell>{money(value(item) / item.quantity)}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell className="font-semibold">{money(value(item))}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="danger"
                      className="whitespace-nowrap"
                      onClick={() => remove(item)}
                      disabled={busy !== null}
                    >
                      {busy === item.id ? 'Removendo…' : 'Remover'}
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </tbody>
        </DataTable>
        <aside className="bg-brand-surface border border-brand-border rounded-panel p-[25px] shadow-panel max-[640px]:p-5">
          <h2 className="text-[18px] font-bold mb-4.5">Resumo do Pedido</h2>
          <p className="text-sm text-gray-500">
            {cartCount} {cartCount === 1 ? 'embalagem' : 'embalagens'} no carrinho
          </p>
          <div className="flex flex-wrap gap-5 justify-between items-center text-[15px] my-[23px] mx-0">
            <span>Total</span>
            <strong className="text-brand-accent text-[27px] font-extrabold">{money(total)}</strong>
          </div>
          {items.length ? (
            <Button className="w-full" href="/purchase/data">
              Continuar para Entrega
            </Button>
          ) : (
            <p className="text-sm text-gray-500">Escolha um produto para começar seu pedido.</p>
          )}
        </aside>
      </div>
    </BaseLayout>
  )
}
export const getServerSideProps = withSession(loadCart)
