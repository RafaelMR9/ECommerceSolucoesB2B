import { apiProductsUrl } from '@/config'
import { apiRequest } from './request'
export const getCategories = () => apiRequest(`${apiProductsUrl}/categories/`)

const categoryData = (data) => ({ name: data.name, category: data.subCategory || null })
export const registerCategory = (data) =>
  apiRequest(`${apiProductsUrl}/categories/register/`, 'POST', categoryData(data))
export const updateCategory = (data, id) =>
  apiRequest(`${apiProductsUrl}/categories/${id}/update/`, 'PUT', categoryData(data))
export const removeCategory = (id) =>
  apiRequest(`${apiProductsUrl}/categories/${id}/delete/`, 'DELETE')
function productData(data) {
  const form = new FormData()
  for (const key of [
    'name',
    'currentStockQuantity',
    'visible',
    'costPrice',
    'salePrice',
    'description',
    'packaging',
    'category',
    'supplier',
    'image',
  ]) {
    if (data[key] !== undefined && data[key] !== null) form.append(key, data[key])
  }
  return form
}
export const registerProduct = (data) =>
  apiRequest(`${apiProductsUrl}/register/`, 'POST', productData({ ...data, visible: true }))
export const updateProduct = (data, id) =>
  apiRequest(`${apiProductsUrl}/${id}/update/`, 'PATCH', productData(data))
export const removeProduct = (id) => apiRequest(`${apiProductsUrl}/${id}/delete/`, 'DELETE')
