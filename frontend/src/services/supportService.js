import { apiSupportUrl } from '../config'

export const registerTicket = async (formData) => {
  const options = {
    method: 'post',
    headers: new Headers({ 
      'Content-Type': 'application/json' }),
    body: JSON.stringify({ 
      ...formData
    })
  }
  const response = await fetch(`${apiSupportUrl}/register/`, options)
  if (!response.ok) {
    const data = await response.json()
    const modifiedData =  Object.keys(data).reduce((acc, key) => {
      acc[key] = data[key].join('\n')
      return acc
    }, {})
    throw new Error(JSON.stringify(modifiedData))
  }
}

export const getUserTickets = async (id) => {
  const response = await fetch(`${apiSupportUrl}/filter/?user=${id}`)
  if (response.ok) {
    const data = await response.json()
    return data
  }
  else
    throw new Error("Erro ao obter tickets do usuário.")
}

export const getTickets = async () => {
  const response = await fetch(`${apiSupportUrl}/`)
  if (response.ok) {
    const data = await response.json()
    return data
  }
  else
    throw new Error("Erro ao obter tickets.")
}

export const getTicket = async (id) => {
  const response = await fetch(`${apiSupportUrl}/${id}/detail/`)
  if (response.ok) {
    const data = await response.json()
    return data
  }
  else
    throw new Error("Erro ao obter ticket.")
}

export const getTicketResponses = async (id) => {
  const response = await fetch(`${apiSupportUrl}/${id}/responses/`)
  if (response.ok) {
    const data = await response.json()
    return data
  }
  else
    throw new Error("Erro ao obter respostas.")
}