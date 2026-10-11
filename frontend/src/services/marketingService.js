import { apiMarketingUrl } from '@/config'
import { apiRequest } from './request'
export const registerPromotion = (data) => apiRequest(`${apiMarketingUrl}/register/`, 'POST', data)
