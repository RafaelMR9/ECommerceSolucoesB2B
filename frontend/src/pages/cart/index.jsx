import PurchaseLayout from '@/components/checkout/PurchaseLayout'
import OrderSummary from '@/components/checkout/OrderSummary'
import { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import BaseLayout from '@/components/shared/BaseLayout'
import PageHeader from '@/components/ui/PageHeader'
import DataTable, { TableHeader, TableRow, TableCell } from '@/components/ui/DataTable'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import { AuthContext } from '@/contexts/authContext'
import { removeCartItem } from '@/services/checkoutService'
import { money, errorFields } from '@/lib/format'
import { withSession } from '@/lib/server/page'
import { loadCart } from '@/lib/server/orderLoaders'
export default function Cart({ items, products }) {
  const productsById = new Map(products.map((product) => [product.id, product]))
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
      <PurchaseLayout
        summary={
          <OrderSummary
            total={total}
            description={`${cartCount} ${cartCount === 1 ? 'embalagem' : 'embalagens'} no carrinho`}
          >
            {items.length ? (
              <Button className="w-full" href="/purchase/data">
                Continuar para Entrega
              </Button>
            ) : (
              <p className="text-small text-brand-muted">
                Escolha um produto para começar seu pedido.
              </p>
            )}
          </OrderSummary>
        }
      >
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
              const product = productsById.get(item.product)
              return (
                <TableRow key={item.id}>
                  <TableCell className="min-w-40">
                    {product?.name || 'Produto indisponível'}
                  </TableCell>
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
      </PurchaseLayout>
    </BaseLayout>
  )
}
export const getServerSideProps = withSession(loadCart)
