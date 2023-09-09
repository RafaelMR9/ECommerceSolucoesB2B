import { apiUsersUrl } from '../config'

export const updateUser = async (formData, id, username) => {
  const options = {
    method: 'put',
    headers: new Headers({ 
      'Content-Type': 'application/json' }),
    body: JSON.stringify({ 
      ...formData,
      username
    })
  }
  const response = await fetch(`${apiUsersUrl}/${id}/update/`, options)
  if (response.ok) {
    const data = await response.json()
    return data
  }
  else {
    const data = await response.json()
    const modifiedData =  Object.keys(data).reduce((acc, key) => {
      acc[key] = data[key].join('\n')
      return acc
    }, {})
    throw new Error(JSON.stringify(modifiedData))
  }
}

export const getUser = async (id) => {
  const response = await fetch(`${apiUsersUrl}/${id}/detail/`)
  if (response.ok) {
    const data = await response.json()
    return data
  }
  else
    throw new Error("Erro ao obter usuário.")
}

export const getUsers = async (id) => {
  const response = await fetch(`${apiUsersUrl}/`)
  if (response.ok) {
    const data = await response.json()
    return data
  }
  else
    throw new Error("Erro ao obter usuários.")
}

export const getAdministrator = async () => {
  const response = await fetch(`${apiUsersUrl}/admin_id`)
  if (response.ok) {
    const data = await response.json()
    return data
  }
  else
    throw new Error("Erro ao obter administrador.")
}