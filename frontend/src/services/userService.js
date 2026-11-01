import { apiUsersUrl } from '@/config'
import { apiRequest } from './request'

export const updateUser = (data, id) => apiRequest(`${apiUsersUrl}/${id}/update/`, 'PATCH', data)

export const reviewCredit = (id, approved) =>
  apiRequest(`${apiUsersUrl}/${id}/credit-analysis/`, 'POST', { approved })
