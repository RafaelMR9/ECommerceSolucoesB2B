import { apiProductsUrl } from '../config'

export const getCategories = async () => {
  const response = await fetch(`${apiProductsUrl}/categories/`)
  if (response.ok) {
    const data = await response.json()
    return data
  }
  else
    throw new Error("Erro ao obter categorias.")
}

export const getCategory = async (id) => {
  const response = await fetch(`${apiProductsUrl}/categories/${id}/detail/`)
  if (response.ok) {
    const data = await response.json()
    return data
  }
  else
    throw new Error("Erro ao obter categoria.")
}

export const filterCategories = async (formData) => {
  const response = await fetch(`${apiProductsUrl}/categories/filter?fetchCategories=${formData}`)
  if (response.ok) {
    const data = await response.json()
    return data
  }
  else
    throw new Error("Erro ao buscar categorias.")
}

export const registerCategory = async (formData) => {
  const options = {
    method: 'post',
    headers: new Headers({ 
      'Content-Type': 'application/json' }),
    body: JSON.stringify({ 
      name: formData.name,
      category: formData.subCategory ? formData.subCategory : null
    })
  }
  const response = await fetch(`${apiProductsUrl}/categories/register/`, options)
  if (!response.ok) {
    const data = await response.json()
    const modifiedData = Object.values(data).flat().join('\n')
    throw new Error(modifiedData)
  }
}

export const updateCategory = async (formData, id) => {
  const options = {
    method: 'put',
    headers: new Headers({ 
      'Content-Type': 'application/json' }),
    body: JSON.stringify({ 
      name: formData.name,
      category: formData.subCategory ? formData.subCategory : null
    })
  }
  const response = await fetch(`${apiProductsUrl}/categories/${id}/update/`, options)
  if (!response.ok) {
    const data = await response.json()
    const modifiedData = Object.values(data).flat().join('\n')
    throw new Error(modifiedData)
  }
}

export const removeCategory = async (id) => {
  const options = {
    method: 'delete'
  }
  const response = await fetch(`${apiProductsUrl}/categories/${id}/delete/`, options)

  if (!response.ok) {
    const data = await response.json()
    throw new Error(JSON.stringify(data))
  }
}

export const getProducts = async () => {
  const response = await fetch(`${apiProductsUrl}/`)
  if (response.ok) {
    const data = await response.json()
    return data
  }
  else
    throw new Error("Erro ao obter produtos.")
}

export const getProduct = async (id) => {
  const response = await fetch(`${apiProductsUrl}/${id}/detail/`)
  if (response.ok) {
    const data = await response.json()
    return data
  }
  else
    throw new Error("Erro ao obter produto.")
}

export const filterProductsByName = async (name) => {
  const response = await fetch(`${apiProductsUrl}/filterName?fetchProduct=${name}`)
  if (response.ok) {
    const data = await response.json()
    return data
  }
  else
    throw new Error("Erro ao buscar produto.")
}

export const filterProductsByCategory = async (category) => {
  const response = await fetch(`${apiProductsUrl}/filterCategory?categoryId=${category}`)
  if (response.ok) {
    const data = await response.json()
    return data
  }
  else
    throw new Error("Erro ao buscar produto.")
}

export const registerProduct = async (formData) => {
  const form = new FormData()

  form.append('name', formData.name)
  form.append('currentStockQuantity', formData.currentStockQuantity)
  form.append('visible', true)
  form.append('costPrice', formData.costPrice)
  form.append('salePrice', formData.salePrice)
  form.append('description', formData.description)
  form.append('packaging', formData.packaging)
  form.append('category', formData.category)
  form.append('supplier', formData.supplier)
  form.append('image', formData.image)

  const options = {
    method: 'post',
    body: form
  }

  const response = await fetch(`${apiProductsUrl}/register/`, options)
  if (!response.ok) {
    const data = await response.json()
    const modifiedData =  Object.keys(data).reduce((acc, key) => {
      acc[key] = data[key].join('\n')
      return acc
    }, {})
    throw new Error(JSON.stringify(modifiedData))
  }
}

export const updateProduct = async (formData, id) => {
  const form = new FormData()

  if ('name' in formData)
    form.append('name', formData.name)
  if ('currentStockQuantity' in formData)
    form.append('currentStockQuantity', formData.currentStockQuantity)
  if ('visible' in formData)
    form.append('visible', formData.visible)
  if ('costPrice' in formData)
    form.append('costPrice', formData.costPrice)
  if ('salePrice' in formData)
    form.append('salePrice', formData.salePrice)
  if ('description' in formData)
    form.append('description', formData.description)
  if ('packaging' in formData)
    form.append('packaging', formData.packaging)
  if ('category' in formData)
    form.append('category', formData.category)
  if ('supplier' in formData)
    form.append('supplier', formData.supplier)
  if ('image' in formData)
    form.append('image', formData.image)
  
  const options = {
    method: 'put',
    body: form
  }

  const response = await fetch(`${apiProductsUrl}/${id}/update/`, options)
  if (!response.ok) {
    const data = await response.json()
    console.log(data)
    const modifiedData =  Object.keys(data).reduce((acc, key) => {
      acc[key] = data[key].join('\n')
      return acc
    }, {})
    throw new Error(JSON.stringify(modifiedData))
  }
}

export const removeProduct = async (id) => {
  const options = {
    method: 'delete'
  }
  await fetch(`${apiProductsUrl}/${id}/delete/`, options)
}