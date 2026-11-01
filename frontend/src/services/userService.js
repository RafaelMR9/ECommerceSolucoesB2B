import { apiUsersUrl } from '@/config'
import { apiRequest } from './request'

export const updateUser = (data, id, username) =>
  apiRequest(`${apiUsersUrl}/${id}/update/`, 'PUT', { ...data, username })

export const reviewCredit = (id, approved) =>
  apiRequest(`${apiUsersUrl}/${id}/credit-analysis/`, 'POST', { approved })
