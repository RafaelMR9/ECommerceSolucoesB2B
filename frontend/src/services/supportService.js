import { apiSupportUrl } from '@/config'
import { apiRequest } from './request'
export const getTicketResponses = (id) => apiRequest(`${apiSupportUrl}/${id}/responses/`)
export const registerTicket = (data) => apiRequest(`${apiSupportUrl}/register/`, 'POST', data)
