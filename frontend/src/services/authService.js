import { apiUsersUrl } from '@/config'
import { apiRequest } from './request'
export const registerUser = (data) =>
  apiRequest(`${apiUsersUrl}/register/`, 'POST', {
    email: data.email,
    username: data.username,
    password: data.password,
    confirmPassword: data.confirmPassword,
    cnpj: data.cnpj,
    cpf: null,
    address: data.address,
    name: data.name,
    authorizeFature: data.authorizeFature ? false : null,
  })
export const loginUser = (data) => apiRequest('/api/session', 'POST', data)
export const logoutUser = () => apiRequest('/api/session', 'DELETE')
export const resetPassword = (data, id) =>
  apiRequest(`${apiUsersUrl}/passwordReset/${id}/update/`, 'PUT', data)
export const sendResetPasswordEmail = (email) =>
  apiRequest(`${apiUsersUrl}/passwordReset/sendResetEmail/`, 'POST', { email })
