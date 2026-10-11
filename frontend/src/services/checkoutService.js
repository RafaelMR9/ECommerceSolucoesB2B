import { apiOrdersUrl } from '@/config'
import { apiRequest } from './request'
export const addCartItem = (product, quantity) =>
  apiRequest(`${apiOrdersUrl}/cart/add/`, 'POST', { product, quantity })
export const removeCartItem = (id) =>
  apiRequest(`${apiOrdersUrl}/cart/items/${id}/delete/`, 'DELETE')
export const checkout = (data) => apiRequest(`${apiOrdersUrl}/checkout/`, 'POST', data)
