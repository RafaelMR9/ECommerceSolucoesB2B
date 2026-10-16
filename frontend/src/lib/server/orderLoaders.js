export async function loadOrders(
  { api, user },
  { supplier = false, admin = false, recurring = false, payments = false } = {}
) {
  const endpoint = supplier ? 'supplierOrder' : 'salesOrder'
  let ordersPath = `orders/${endpoint}/`
  if (!admin && !supplier) ordersPath += `user/?user=${user.id}`

  let companiesPath = ''
  if (admin) companiesPath = 'users/'
  else if (supplier) companiesPath = 'suppliers/'

  const [allOrders, companies, carriers] = await Promise.all([
    api(ordersPath),
    companiesPath ? api(companiesPath) : [],
    admin && !payments ? api('carriers/') : [],
  ])
  const orders = allOrders.filter((order) => {
    const isRecurring = order.deliveryFrequency !== null
    if (isRecurring !== recurring) return false
    if (payments && order.cancelled !== null) return false
    return true
  })
  return { orders, companies, carriers }
}
export function countCartItems(items) {
  return items.reduce((total, item) => total + Number(item.quantity), 0)
}
export async function loadCartItems({ api, user }) {
  const orderType = user.is_superuser ? 'supplierOrder' : 'salesOrder'
  const itemType = user.is_superuser ? 'itemSupplierOrder' : 'itemSalesOrder'
  const orders = await api(`orders/${orderType}/getUnfinished/?user=${user.id}`)
  const order = orders[0] || null
  if (!order) return { order: null, items: [] }
  const items = await api(`orders/${itemType}/${order.id}/?user=${user.id}`)
  return { order, items }
}
export async function loadCart(context) {
  const [cart, products] = await Promise.all([loadCartItems(context), context.api('products/')])
  return { ...cart, products }
}
