import { apiOrdersUrl } from '../config'

export const registerSalesOrder = async (formData) => {
  const options = {
    method: 'post',
    headers: new Headers({ 
      'Content-Type': 'application/json' }),
    body: JSON.stringify({ 
      orderDate: formData.orderDate,
      deliveryDate: null,
      cancelled: false,
      sending: false,
      recieved: false,
      paid: null,
      faturedPayment: false,
      finished: false,
      totalSaleValue: 0,
      deliveryFrequency: null,
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
      ...formData
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
      return data[0]
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
    const data = await response.json()
    console.log(JSON.stringify(data))
    throw new Error("Erro ao criar item do pedido.")
  }
}

export const removeItemSaleOrder = async (id) => {
  const options = {
    method: 'delete'
  }
  await fetch(`${apiOrdersUrl}/itemSalesOrder/${id}/delete/`, options)
}




export const registerSupplierOrder = async (formData) => {
  const options = {
    method: 'post',
    headers: new Headers({ 
      'Content-Type': 'application/json' }),
    body: JSON.stringify({ 
      orderDate: formData.orderDate,
      deliveryDate: null,
      cancelled: false,
      recieved: null,
      faturedPayment: false,
      finished: false,
      totalCostValue: 0,
      deliveryFrequency: null,
      supplier: formData.supplier,
      user: formData.user
    })
  }
  const response = await fetch(`${apiOrdersUrl}/supplierOrder/register/`, options)
  if (response.ok) {
    const data = await response.json()
    return data.id
  }
  else {
    throw new Error("Erro ao criar pedido.")
  }
}

export const updateSupplierOrder = async (formData, id) => {
  const options = {
    method: 'put',
    headers: new Headers({ 
      'Content-Type': 'application/json' }),
    body: JSON.stringify({ 
      ...formData
    })
  }
  const response = await fetch(`${apiOrdersUrl}/supplierOrder/${id}/update/`, options)
  if (!response.ok) {
    const data = await response.json()
    const modifiedData =  Object.keys(data).reduce((acc, key) => {
      acc[key] = data[key].join('\n')
      return acc
    }, {})
    throw new Error(JSON.stringify(modifiedData))
  }
}

export const getSupplierOrders = async () => {
  const response = await fetch(`${apiOrdersUrl}/supplierOrder`)
  if (response.ok) {
    const data = await response.json()
    return data
  }
  else
    throw new Error("Erro ao obter pedidos.")
}

export const getUserSupplierOrders = async (id) => {
  const response = await fetch(`${apiOrdersUrl}/supplierOrder/user/?user=${id}`)
  if (response.ok) {
    const data = await response.json()
    return data
  }
  else
    throw new Error("Erro ao obter pedidos do usuário.")
}

export const getUserUnfinishedSupplierOrder = async (id) => {
  const response = await fetch(`${apiOrdersUrl}/supplierOrder/getUnfinished/?user=${id}`)
  if (response.ok) {
    const data = await response.json()
    if (data.length !== 0)
      return data[0]
    else
      return data
  }
  else
    throw new Error("Erro ao obter pedido não finalizado.")
}

export const getUserProductsInSupplierOrder = async (supplierOrderId, userId) => {
  const response = await fetch(`${apiOrdersUrl}/itemSupplierOrder/${supplierOrderId}/?user=${userId}`)
  if (response.ok) {
    const data = await response.json()
    return data
  }
  else {
    throw new Error("Erro ao obter itens do pedido.")
  }
}

export const removeSupplierOrder = async (id) => {
  const options = {
    method: 'delete'
  }
  await fetch(`${apiOrdersUrl}/supplierOrder/${id}/delete/`, options)
}

export const registerItemSupplierOrder = async (formData) => {
  const options = {
    method: 'post',
    headers: new Headers({ 
      'Content-Type': 'application/json' }),
    body: JSON.stringify({ 
      costPrice: formData.costPrice,
      quantity: formData.quantity,
      product: formData.product,
      supplierOrder: formData.supplierOrder
    })
  }
  const response = await fetch(`${apiOrdersUrl}/itemSupplierOrder/register/`, options)
  if (!response.ok) {
    throw new Error("Erro ao criar item do pedido.")
  }
}

export const removeItemSupplierOrder = async (id) => {
  const options = {
    method: 'delete'
  }
  await fetch(`${apiOrdersUrl}/itemSupplierOrder/${id}/delete/`, options)
}