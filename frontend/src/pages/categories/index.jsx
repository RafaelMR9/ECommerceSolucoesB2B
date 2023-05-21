import Link from "next/link"
import BaseLayout from "@/components/shared/BaseLayout"
import ProtectedRoute from "@/components/routes/ProtectedRoute"
import { getCategories } from "@/services/productService"
import { AuthContext } from "@/contexts/authContext"
import { useEffect, useState, useContext } from "react"

export default function Categories() {
  const { user } = useContext(AuthContext)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getCategories()
        setCategories(buildCategoryTree(categories))
      } catch (e) {
        alert(e)
      }
    }

    fetchCategories()
  }, [])

  const buildCategoryTree = (categories, parentId = null) => {
    const tree = []
    categories
      .filter((category) => category.categoria === parentId)
      .forEach((category) => {
        const subcategories = buildCategoryTree(categories, category.id)
        if (subcategories.length > 0) {
          category.subcategorias = subcategories
        }
        tree.push(category)
      })
    return tree
  }

  const renderCategories = (category) => {
    return (
      <div key={category.id}>
        <h2 className="text-xl font-bold mb-2">{category.nome}</h2>
        {category.subcategorias && renderSubcategories(category.subcategorias)}
      </div>
    )
  }

  const renderSubcategories = (subcategories) => {
    return (
      <ul className="pl-8 list-disc">
        {subcategories.map((subcategory) => (
          <li key={subcategory.id} className="mb-4 mt-2">
            {subcategory.nome}
            {subcategory.subcategorias && renderSubcategories(subcategory.subcategorias)}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <ProtectedRoute isProtected>
      <BaseLayout>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-slate-800">Categorias</h1>
          <div className="flex-shrink-0 flex-grow">
            <form className="flex px-20">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Buscar Categoria"
              />
              <button className="ml-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                Pesquisar
              </button>
            </form>
          </div>
          {user.is_superuser &&
            <Link href="/categories/register" className="hover:bg-white border-2 border-blue-600 text-blue-600 flex items-center font-bold py-2 px-8 rounded focus:outline-none focus:shadow-outline">
              Cadastrar Categoria
            </Link>
          }
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {categories.map((category) => {
            return (
              <ul key={category.id}>
                {renderCategories(category)}
              </ul>
            )
          })}
        </div>
      </BaseLayout>
    </ProtectedRoute>
  )
}