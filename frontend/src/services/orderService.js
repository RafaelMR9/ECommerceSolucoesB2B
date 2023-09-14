import { apiOrdersUrl } from '../config'

export const registerSalesOrder = async (formData) => {
  const options = {
    method: 'post',
    headers: new Headers({ 
      'Content-Type': 'application/json' }),
    body: JSON.stringify({ 
      orderDate: formData.orderDate,
      deliveryDate: formData.deliveryDate,
      cancelled: false,
      faturedPayment: formData.faturedPayment,
      finished: false,
      totalSaleValue: formData.totalSaleValue,
      deliveryFrequency: formData.deliveryFrequency,
      user: formData.user
    })
  }
  const response = await fetch(`${apiOrdersUrl}/salesOrder/register/`, options)
  if (response.ok) {
    const data = await response.json()
    return data.id
  }
  else {
    throw new Error("Erro ao criar pedido.")
  }
}

export const updateSalesOrder = async (formData, id) => {
  const options = {
    method: 'put',
    headers: new Headers({ 
      'Content-Type': 'application/json' }),
    body: JSON.stringify({ 
      orderDate: formData.orderDate,
      deliveryDate: formData.deliveryDate,
      cancelled: formData.cancelled,
      faturedPayment: formData.faturedPayment,
      finished: formData.finished,
      totalSaleValue: formData.totalSaleValue,
      deliveryFrequency: formData.deliveryFrequency,
      user: formData.user
    })
  }
  const response = await fetch(`${apiOrdersUrl}/salesOrder/${id}/update/`, options)
  if (!response.ok) {
    const data = await response.json()
    const modifiedData =  Object.keys(data).reduce((acc, key) => {
      acc[key] = data[key].join('\n')
      return acc
    }, {})
    throw new Error(JSON.stringify(modifiedData))
  }
}

export const getSalesOrders = async () => {
  const response = await fetch(`${apiOrdersUrl}/salesOrder`)
  if (response.ok) {
    const data = await response.json()
    return data
  }
  else
    throw new Error("Erro ao obter pedidos.")
}

export const getUserSalesOrder = async (id) => {
  const response = await fetch(`${apiOrdersUrl}/salesOrder/user/?user=${id}`)
  if (response.ok) {
    const data = await response.json()
    return data
  }
  else
    throw new Error("Erro ao obter pedidos do usuário.")
}

export const getUserUnfinishedSalesOrder = async (id) => {
  const response = await fetch(`${apiOrdersUrl}/salesOrder/getUnfinished/?user=${id}`)
  if (response.ok) {
    const data = await response.json()
    if (data.length !== 0)
      return data[0].id
    else
      return data
  }
  else
    throw new Error("Erro ao obter pedido não finalizado.")
}

export const getUserProductsInSalesOrder = async (saleOrderId, userId) => {
  const response = await fetch(`${apiOrdersUrl}/itemSalesOrder/${saleOrderId}/?user=${userId}`)
  if (response.ok) {
    const data = await response.json()
    return data
  }
  else {
    throw new Error("Erro ao obter itens do pedido.")
  }
}

export const registerItemSalesOrder = async (formData) => {
  const options = {
    method: 'post',
    headers: new Headers({ 
      'Content-Type': 'application/json' }),
    body: JSON.stringify({ 
      salePrice: formData.salePrice,
      quantity: formData.quantity,
      product: formData.product,
      salesOrder: formData.salesOrder
    })
  }
  const response = await fetch(`${apiOrdersUrl}/itemSalesOrder/register/`, options)
  if (!response.ok) {
    throw new Error("Erro ao criar item do pedido.")
  }
}

export const removeItemSaleOrder = async (id) => {
  const options = {
    method: 'delete'
  }
  await fetch(`${apiOrdersUrl}/itemSalesOrder/${id}/delete/`, options)
}