import { apiSuppliersUrl } from '../config'

export const getSuppliers = async () => {
  const response = await fetch(`${apiSuppliersUrl}/`)
  if (response.ok) {
    const data = await response.json()
    return data
  }
  else
    throw new Error("Erro ao obter fornecedores.")
}

export const getSupplier = async (id) => {
  const response = await fetch(`${apiSuppliersUrl}/${id}/detail/`)
  if (response.ok) {
    const data = await response.json()
    return data
  }
  else
    throw new Error("Erro ao obter fornecedor.")
}

export const registerSupplier = async (formData) => {
  const options = {
    method: 'post',
    headers: new Headers({ 
      'Content-Type': 'application/json' }),
    body: JSON.stringify({ 
      ...formData
    })
  }
  const response = await fetch(`${apiSuppliersUrl}/register/`, options)
  if (!response.ok) {
    const data = await response.json()
    const modifiedData =  Object.keys(data).reduce((acc, key) => {
      acc[key] = data[key].join('\n')
      return acc
    }, {})
    throw new Error(JSON.stringify(modifiedData))
  }
}

export const updateSupplier = async (formData, id) => {
  const options = {
    method: 'put',
    headers: new Headers({ 
      'Content-Type': 'application/json' }),
    body: JSON.stringify({ 
      ...formData
    })
  }
  const response = await fetch(`${apiSuppliersUrl}/${id}/update/`, options)
  if (!response.ok) {
    const data = await response.json()
    const modifiedData =  Object.keys(data).reduce((acc, key) => {
      acc[key] = data[key].join('\n')
      return acc
    }, {})
    throw new Error(JSON.stringify(modifiedData))
  }
}

export const filterSuppliers = async (formData) => {
  const response = await fetch(`${apiSuppliersUrl}/filter?fetchSuppliers=${formData}`)
  if (response.ok) {
    const data = await response.json()
    return data
  }
  else
    throw new Error("Erro ao buscar fornecedores.")
}

export const removeSupplier = async (id) => {
  const options = {
    method: 'delete'
  }
  await fetch(`${apiSuppliersUrl}/${id}/delete/`, options)
}