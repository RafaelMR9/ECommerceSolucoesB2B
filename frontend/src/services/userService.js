import { apiUsersUrl } from '../config'

export const registerUser = async (formData, uId) => {
  const options = {
    method: 'post',
    headers: new Headers({ 
      'Content-Type': 'application/json' }),
    body: JSON.stringify({ 
      email: formData.email,
      cnpj: formData.cnpj,
      cpf: formData.cpf,
      endereco: formData.address
    })
  }
  const response = await fetch(`${apiUsersUrl}/${uId}/update/`, options)
  if (response.ok) {
    const data = await response.json()
    return data
  }
  else {
    const data = await response.json()
    const modifiedData =  Object.keys(data).reduce((acc, key) => {
      acc[key] = data[key].join('\n');
      return acc;
    }, {})
    throw new Error(JSON.stringify(modifiedData))
  }
}