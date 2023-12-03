import { useState, useEffect } from 'react'
import { getCategories, registerProduct } from "@/services/productService"
import Link from "next/link"
import BaseLayout from "@/components/shared/BaseLayout"
import ProtectedRoute from '@/components/routes/ProtectedRoute'
import { getSuppliers } from '@/services/supplierService'

export default function RegisterProduct() {

  const [formErrors, setFormErrors] = useState({
    category: "",
    name: "",
    supplier: "",
    image: ""
  })
  const [successMessage, setSuccessMessage] = useState("")
  const [categories, setCategories] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [formData, setFormData] = useState({
    name: "",
    currentStockQuantity: "",
    costPrice: "",
    salePrice: "",
    description: "",
    packaging: "",
    category: "",
    supplier: "",
    image: null,
  })

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getCategories()
        setCategories(categories)
      } catch (e) {
        alert(e.message)
      }
    }

    const fetchSuppliers = async () => {
      try {
        const suppliers = await getSuppliers()
        setSuppliers(suppliers)
      } catch (e) {
        alert(e.message)
      }
    }
    
    fetchCategories()
    fetchSuppliers()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }))

    setFormErrors((prevErrors) => {
      const errors = { ...prevErrors }
      if (name === 'name')
        errors.name = ''
      if (name === 'category')
        errors.category = ''
      if (name === 'supplier')
        errors.supplier = ''
      return errors
    })
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    
    setFormData((prevFormData) => ({
      ...prevFormData,
      image: file,
    }))

    setFormErrors((prevErrors) => {
      const errors = { ...prevErrors }
      if (errors.image)
        errors.image = ''
      return errors
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    setSuccessMessage("")
    if (Object.values(formErrors).some(value => value !== ""))
      return

    try {
      await registerProduct(formData)

      setSuccessMessage("Produto criado com sucesso.")
      setFormData((prevStateData) => ({
        ...prevStateData,
        name: "",
        currentStockQuantity: "",
        costPrice: "",
        salePrice: "",
        description: "",
        packaging: "",
        image: null
      }))
    } catch (e) {
      const errorObj = JSON.parse(e.message)
      setFormErrors(errorObj)
    }
    return
  }

  return (
    <ProtectedRoute isProtected isAdminOnly>
      <BaseLayout>
        <h1 className="text-4xl font-bold text-slate-800 mb-8">Cadastrar Produto</h1>
        <div className="grid grid-cols-2 gap-8">
          <form className="max-w-lg" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
                Nome
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                placeholder="Nome do Produto"
                required
              />
              {formErrors.name && <p className="mt-2 text-red-600">{formErrors.name}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="currentStockQuantity">
                Quantidade em Estoque
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="currentStockQuantity"
                name="currentStockQuantity"
                value={formData.currentStockQuantity}
                onChange={handleChange}
                type="number"
                placeholder="Quantidade Atual em Estoque do Produto"
                min={0}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="costPrice">
                Preço de Custo
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="costPrice"
                name="costPrice"
                value={formData.costPrice}
                onChange={handleChange}
                type="number"
                placeholder="Preço de Custo do Produto"
                min={0.01}
                step={0.01}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="salePrice">
                Preço de Venda
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="salePrice"
                name="salePrice"
                value={formData.salePrice}
                onChange={handleChange}
                type="number"
                placeholder="Preço de Venda do Produto"
                min={0.01}
                step={0.01}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="description">
                Descrição
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descrição do Produto"
                required
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="packaging">
                Unidades por Embalagem
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="packaging"
                name="packaging"
                value={formData.packaging}
                onChange={handleChange}
                type="number"
                placeholder="Unidades por Embalagem do Produto"
                min={1}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="category">
                Categoria
              </label>
              <select
                id="category"
                name="category"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">
                  Escolha uma categoria
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {formErrors.category && <p className="mt-2 text-red-600">{formErrors.category}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="supplier">
                Fornecedor
              </label>
              <select
                id="supplier"
                name="supplier"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={formData.supplier}
                onChange={handleChange}
              >
                <option value="">
                  Escolha um fornecedor
                </option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
              {formErrors.supplier && <p className="mt-2 text-red-600">{formErrors.supplier}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="imageUpload" className="block text-gray-700 font-bold mb-2">
                Imagem
              </label>
              <input
                type="file"
                id="imageUpload"
                onChange={handleImageUpload}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-white"
                required
              />
              {formErrors.image && <p className="mt-2 text-red-600">{formErrors.image}</p>}
            </div>
            {successMessage && <p className="mb-4 text-green-600">{successMessage}</p>}
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Cadastrar
            </button>
          </form>
          <div className="flex items-center justify-center">
            <div className="w-90 h-80 mx-auto mt-4">
              {formData.image &&
                <img
                  id="imagePreview"
                  className="w-full h-full object-contain border-4 border-blue-600 rounded"
                  src={URL.createObjectURL(formData.image)}
                  alt="Imagem"
                />
              }
            </div>
          </div>
        </div>
        <hr className="mt-6 border border-gray-400"/>
        <div className="mt-8 text-center">
          <p className="text-gray-700">
            Não quer Cadastrar um Produto? <Link href="/products" className="text-blue-600">Voltar para a Página de Produtos</Link>.
          </p>
        </div>
      </BaseLayout>
    </ProtectedRoute>
  )
}