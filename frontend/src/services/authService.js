import { apiUsersUrl } from '../config'
import jwt_decode from 'jwt-decode'

export const registerUser = async (formData) => {
  const options = {
    method: 'post',
    headers: new Headers({ 
      'Content-Type': 'application/json' }),
    body: JSON.stringify({ 
      email: formData.email,
      username: formData.username,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      cnpj: formData.cnpj,
      cpf: null,
      endereco: formData.address, 
      podeFaturada: formData.podeFaturada ? false : null,
      podeComprar: true
    })
  }
  const response = await fetch(`${apiUsersUrl}/register/`, options)
  if (!response.ok) {
    const data = await response.json()
    const modifiedData =  Object.keys(data).reduce((acc, key) => {
      acc[key] = data[key].join('\n');
      return acc;
    }, {})
    throw new Error(JSON.stringify(modifiedData))
  }
}

export const loginUser = async (formData, authContext) => {
  const options = {
    method: 'post',
    headers: new Headers({ 
      'Content-Type': 'application/json' }),
    body: JSON.stringify({
      username: formData.username,
      password: formData.password,
    })
  }
  const response = await fetch(`${apiUsersUrl}/token/`, options)
  if (response.ok) {
    const data = await response.json()
    authContext.setAuthTokens(data)
    authContext.setUser(jwt_decode(data.access))
    localStorage.setItem('authTokens', JSON.stringify(data))
    return
  } else {
    const data = await response.json()
    throw new Error(JSON.stringify(data))
  }
}

export const logoutUser = (authContext) => {
  authContext.setAuthTokens(null)
  authContext.setUser(null)
  localStorage.removeItem('authTokens')
}