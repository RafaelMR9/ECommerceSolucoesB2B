export async function loadOrders(
  { api, user },
  { supplier = false, admin = false, recurring = false, payments = false } = {}
) {
  const endpoint = supplier ? 'supplierOrder' : 'salesOrder'
  const [allOrders, companies, carriers] = await Promise.all([
    api(`orders/${endpoint}/${admin || supplier ? '' : `user/?user=${user.id}`}`),
    admin ? api('users/') : supplier ? api('suppliers/') : Promise.resolve([]),
    admin && !payments ? api('carriers/') : Promise.resolve([]),
  ])
  const orders = allOrders.filter(
    (order) =>
      (order.deliveryFrequency !== null) === recurring && (!payments || order.cancelled === null)
  )
  return { orders, companies, carriers }
}
export async function loadCart({ api, user }) {
  const kind = user.is_superuser ? 'Supplier' : 'Sales'
  const orders = await api(`orders/${kind.toLowerCase()}Order/getUnfinished/?user=${user.id}`)
  const order = orders[0] || null
  const [items, products] = await Promise.all([
    order ? api(`orders/item${kind}Order/${order.id}/?user=${user.id}`) : Promise.resolve([]),
    api('products/'),
  ])
  return { order, items, products }
}
