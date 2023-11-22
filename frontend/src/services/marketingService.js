import { apiMarketingUrl } from '../config'

export const getPromotions = async () => {
  const response = await fetch(`${apiMarketingUrl}/`)
  if (response.ok) {
    const data = await response.json()
    return data
  }
  else
    throw new Error("Erro ao obter promoções.")
}

export const registerPromotion = async (formData) => {
  const options = {
    method: 'post',
    headers: new Headers({ 
      'Content-Type': 'application/json' }),
    body: JSON.stringify({ 
      ...formData
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

export const getProductPromotion = async (id) => {
  const response = await fetch(`${apiMarketingUrl}/promotion/${id}/`)
  if (response.ok) {
    const data = await response.json()
    return data
  }
  else
    throw new Error("Erro ao obter promoção.")
}