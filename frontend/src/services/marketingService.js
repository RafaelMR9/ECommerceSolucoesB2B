import { apiMarketingUrl } from '../config'

export const registerPromotion = async (formData) => {
  const options = {
    method: 'post',
    headers: new Headers({ 
      'Content-Type': 'application/json' }),
    body: JSON.stringify({ 
      startDate: formData.startDate,
      endDate: formData.endDate,
      salePrice: formData.salePrice,
      product: formData.product
    })
  }
  const response = await fetch(`${apiMarketingUrl}/register/`, options)
  if (!response.ok) {
    const data = await response.json()
    const modifiedData =  Object.keys(data).reduce((acc, key) => {
      acc[key] = data[key].join('\n')
      return acc
    }, {})
    throw new Error(JSON.stringify(modifiedData))
  }
}