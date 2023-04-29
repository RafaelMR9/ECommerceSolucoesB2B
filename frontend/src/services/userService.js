import { apiUserUrl } from '../config'

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
  const response = await fetch(`${apiUserUrl}/create/`, options)
  if (response.ok) {
    const data = await response.json()
    return data
  } else {
    const data = await response.json()
    const modifiedData =  Object.keys(data).reduce((acc, key) => {
      acc[key] = data[key].join('\n');
      return acc;
    }, {})
    throw new Error(JSON.stringify(modifiedData))
  }
}