import { useState, useEffect } from "react"
import { getCategories, registerCategory } from "@/services/productService"
import Link from "next/link"
import BaseLayout from "@/components/shared/BaseLayout"
import ProtectedRoute from "@/components/routes/ProtectedRoute"

export default function RegisterCategory() {
  
  const [formErrors, setFormErrors] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    name: "",
    subCategory: "",
  })

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getCategories()
        setCategories(categories)
      } catch (e) {
        setFormErrors(e.message)
      }
    }

    fetchCategories()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormErrors("")
    setSuccessMessage("")
    try {
      await registerCategory(formData)
      const categories = await getCategories()
      setCategories(categories)
      setSuccessMessage("Categoria criada com sucesso.")
      setFormData({
        name: "",
        subCategory: "",
      })
    } catch (e) {
      setFormErrors(e.message)
    }
  }

  return (
    <ProtectedRoute isProtected isAdminOnly>
      <BaseLayout>
        <h1 className="text-4xl font-bold text-slate-800 mb-8">Cadastrar Categoria</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-base font-medium text-gray-700 mb-2">
              Nome
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="subCategory" className="block text-base font-medium text-gray-700 mb-2">
              Categoria Pai
            </label>
            <select
              id="subCategory"
              name="subCategory"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.subCategory}
              onChange={handleChange}
            >
              <option value="">Selecione uma Sub-Categoria (Opcional)</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nome}
                </option>
              ))}
            </select>
          </div>
          { formErrors && <p className="mb-4 text-red-600">{formErrors}</p>}
          { successMessage && <p className="mb-4 text-green-600">{successMessage}</p>}
          <button
            type="submit"
            className="inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
          >
            Cadastrar
          </button>
        </form>
        <hr className="mt-6 border border-gray-400" />
        <div className="mt-8 text-center">
          <p className="text-gray-700">
            Não quer Cadastrar a Categoria? <Link href="/categories" className="text-blue-600">Voltar para a Página de Categorias</Link>.
          </p>
        </div>
      </BaseLayout>
    </ProtectedRoute>
  )
}