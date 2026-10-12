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
      <div className="checkout-layout">
        <DataTable
          empty={!items.length}
          emptyMessage="Seu carrinho está vazio"
          label="Produtos do Carrinho"
        >
          <thead>
            <tr>
              <th>Produto</th>
              <th>Preço por Embalagem</th>
              <th>Quantidade</th>
              <th>Total</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const product = products.find((p) => p.id === item.product)
              return (
                <tr key={item.id}>
                  <td>{product?.name || 'Produto indisponível'}</td>
                  <td>{money(value(item) / item.quantity)}</td>
                  <td>{item.quantity}</td>
                  <td className="font-semibold">{money(value(item))}</td>
                  <td>
                    <Button
                      variant="danger"
                      className="button-small"
                      onClick={() => remove(item)}
                      disabled={busy !== null}
                    >
                      {busy === item.id ? 'Removendo…' : 'Remover'}
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </DataTable>
        <aside className="panel checkout-summary">
          <h2>Resumo do Pedido</h2>
          <p className="text-sm text-gray-500">
            {cartCount} {cartCount === 1 ? 'embalagem' : 'embalagens'} no carrinho
          </p>
          <div className="total">
            <span>Total</span>
            <strong>{money(total)}</strong>
          </div>
          {items.length ? (
            <Button href="/purchase/data">Continuar para Entrega</Button>
          ) : (
            <p className="text-sm text-gray-500">Escolha um produto para começar seu pedido.</p>
          )}
        </aside>
      </div>
    </BaseLayout>
  )
}
export const getServerSideProps = withSession(loadCart)
