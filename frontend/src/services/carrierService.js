import { apiCarriersUrl } from '@/config'
import { apiRequest } from './request'
export const registerCarrier = (data) => apiRequest(`${apiCarriersUrl}/register/`, 'POST', data)
export const updateCarrier = (data, id) =>
  apiRequest(`${apiCarriersUrl}/${id}/update/`, 'PUT', data)
export const removeCarrier = (id) => apiRequest(`${apiCarriersUrl}/${id}/delete/`, 'DELETE')
