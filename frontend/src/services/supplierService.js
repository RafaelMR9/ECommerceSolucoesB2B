import { apiSuppliersUrl } from '@/config'
import { apiRequest } from './request'
export const registerSupplier = (data) => apiRequest(`${apiSuppliersUrl}/register/`, 'POST', data)
export const updateSupplier = (data, id) =>
  apiRequest(`${apiSuppliersUrl}/${id}/update/`, 'PUT', data)
export const removeSupplier = (id) => apiRequest(`${apiSuppliersUrl}/${id}/delete/`, 'DELETE')
