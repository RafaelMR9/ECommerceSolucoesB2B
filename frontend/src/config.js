const configuredApiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL
if (typeof window === 'undefined' && process.env.NODE_ENV === 'production' && !configuredApiUrl) {
  throw new Error('Defina API_URL antes de gerar o frontend de produção.')
}
export const apiUrl =
  typeof window === 'undefined'
    ? (configuredApiUrl || 'http://127.0.0.1:8000/api/').replace(/\/+$/, '') + '/'
    : '/api/backend/'

export const apiUsersUrl = apiUrl + 'users'
export const apiProductsUrl = apiUrl + 'products'
export const apiMarketingUrl = apiUrl + 'marketing'
export const apiSupportUrl = apiUrl + 'support'
export const apiOrdersUrl = apiUrl + 'orders'
export const apiSuppliersUrl = apiUrl + 'suppliers'
export const apiCarriersUrl = apiUrl + 'carriers'
