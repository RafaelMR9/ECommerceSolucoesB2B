import { apiUsersUrl } from '@/config'
import { apiRequest } from './request'

export const updateUser = (data, id, username) =>
  apiRequest(`${apiUsersUrl}/${id}/update/`, 'PUT', { ...data, username })
