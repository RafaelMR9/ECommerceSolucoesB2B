import { apiCarriersUrl } from '../config'

export const getCarriers = async () => {
  const response = await fetch(`${apiCarriersUrl}/`)
  if (response.ok) {
    const data = await response.json()
    return data
  }
  else
    throw new Error("Erro ao obter transportadoras.")
}

export const getCarrier = async (id) => {
  const response = await fetch(`${apiCarriersUrl}/${id}/detail/`)
  if (response.ok) {
    const data = await response.json()
    return data
  }
  else
    throw new Error("Erro ao obter transportadora.")
}

export const registerCarrier = async (formData) => {
  const options = {
    method: 'post',
    headers: new Headers({ 
      'Content-Type': 'application/json' }),
    body: JSON.stringify({ 
      ...formData
    })
  }
  const response = await fetch(`${apiCarriersUrl}/register/`, options)
  if (!response.ok) {
    const data = await response.json()
    const modifiedData =  Object.keys(data).reduce((acc, key) => {
      acc[key] = data[key].join('\n')
      return acc
    }, {})
    throw new Error(JSON.stringify(modifiedData))
  }
}

export const updateCarrier = async (formData, id) => {
  const options = {
    method: 'put',
    headers: new Headers({ 
      'Content-Type': 'application/json' }),
    body: JSON.stringify({ 
      ...formData
    })
  }
  const response = await fetch(`${apiCarriersUrl}/${id}/update/`, options)
  if (!response.ok) {
    const data = await response.json()
    const modifiedData =  Object.keys(data).reduce((acc, key) => {
      acc[key] = data[key].join('\n')
      return acc
    }, {})
    throw new Error(JSON.stringify(modifiedData))
  }
}

export const filterCarriers = async (formData) => {
  const response = await fetch(`${apiCarriersUrl}/filter?fetchCarriers=${formData}`)
  if (response.ok) {
    const data = await response.json()
    return data
  }
  else
    throw new Error("Erro ao buscar transportadoras.")
}

export const removeCarrier = async (id) => {
  const options = {
    method: 'delete'
  }
  const response = await fetch(`${apiCarriersUrl}/${id}/delete/`, options);

  if (!response.ok) {
    const data = await response.json()
    throw new Error(JSON.stringify(data))
  }
}