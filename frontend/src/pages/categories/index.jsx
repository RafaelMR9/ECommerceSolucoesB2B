import Link from "next/link"
import BaseLayout from "@/components/shared/BaseLayout"
import Modal from "@/components/shared/Modal"
import ProtectedRoute from "@/components/routes/ProtectedRoute"
import { getCategories, removeCategory, filterCategories } from "@/services/productService"
import { AuthContext } from "@/contexts/authContext"
import { useEffect, useState, useContext } from "react"

export default function Categories() {

  const { user } = useContext(AuthContext)
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState("")
  const [message, setMessage] = useState("")
  const [modalRemovalState, setModalRemovalState] = useState(false)
  const [modalErrorState, setModalErrorState] = useState(false)
  const [errorMessage, setErrorMessage] = useState({
    title: "",
    leading: ""
  })

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getCategories()
        if (categories.length === 0) {
          setMessage(`Ainda não existem categorias cadastradas.`)
        }
        setCategories(buildCategoryTree(categories))
      } catch (e) {
        alert(e.message)
      }
    }

    fetchCategories()
  }, [])

  const handleRemoveCategory = async (category) => {
    try {
      await removeCategory(category)
      const categories = await getCategories()
      if (categories.length === 0) {
        setMessage(`Ainda não existem categorias cadastradas.`)
      }
      setCategories(buildCategoryTree(categories))
    } catch (e) {
      const objError = JSON.parse(e.message)
      setErrorMessage({
        title: objError.title,
        leading: objError.leading
      })
      setModalRemovalState({})
      setModalErrorState({ [category]: true })
    }
    setModalRemovalState({})
  }

  const handleResetSearch = async () => {
    try {
      const categories = await getCategories()
      setFormData("")
      setMessage("")
      if (categories.length === 0) {
        setMessage(`Ainda não existem categorias cadastradas.`)
      }
      setCategories(buildCategoryTree(categories))
    } catch (e) {
      alert(e.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData)
      return

    setMessage("")
    try {
      const categories = await filterCategories(formData)
      if (categories.length === 0) {
        setMessage(`Nenhum resultado para a busca '${formData}'.`)
      }
      setCategories(categories)
    } catch (e) {
      alert(e.message)
    }
  }

  const buildCategoryTree = (categories, parentId = null) => {
    const tree = []
    categories
      .filter((category) => category.category === parentId)
      .forEach((category) => {
        const subcategories = buildCategoryTree(categories, category.id)
        if (subcategories.length > 0) {
          category.subcategories = subcategories
        }
        tree.push(category)
      })
    return tree
  }

  const renderCategories = (category) => {
    return (
      <div key={category.id}>
        <div className="flex items-center">
          <Link className="text-xl font-bold hover:text-blue-700 mb-2" href={`/products?categoryId=${category.id}`}>{category.name}</Link>
          {(user && user.is_superuser) &&
            <div className="flex ml-auto">
              <Link href={`/categories/update?categoryId=${category.id}`} className="ml-2 bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded">Atualizar</Link>
              <button
                onClick={() => setModalRemovalState({ [category.id]: true })}
                className="ml-2 bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded">
                Remover
              </button>
              <Modal
                isOpen={modalRemovalState[category.id] || false}
                onClose={() => setModalRemovalState({})}
                onConfirm={() => handleRemoveCategory(category.id)}
                title="Confirmação de Remoção"
                message={`Tem certeza que deseja remover a categoria '${category.name}'?`}
                leading={`Atenção: Remover uma categoria também remove suas subcategorias.`}
                option1="Remover"
                option2="Cancelar"
              />
              <Modal
                isOpen={modalErrorState[category.id] || false}
                onClose={() => setModalErrorState({})}
                onConfirm={() => { setErrorMessage({ title: "", leading: "" }); setModalErrorState({}) }}
                title="Remoção Inválida"
                message={errorMessage.title}
                leading={errorMessage.leading}
                option1="Continuar"
                confirm
              />
            </div>
          }
        </div>
        {category.subcategories && renderSubcategories(category.subcategories)}
      </div>
    )
  }

  const renderSubcategories = (subcategories) => {
    return (
      <ul className="pl-8 list-disc">
        {subcategories.map((subcategory) => (
          <li key={subcategory.id} className="mb-4 mt-2">
            <div className="flex items-center">
              <Link className="font-semibold hover:text-blue-700" href={`/products?categoryId=${subcategory.id}`}>{subcategory.name}</Link>
              {(user && user.is_superuser) &&
                <div className="flex ml-auto">
                  <Link href={`/categories/update?categoryId=${subcategory.id}`} className="ml-2 bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded">Atualizar</Link>
                  <button
                    onClick={() => setModalRemovalState({ [subcategory.id]: true })}
                    className="ml-2 bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded">
                    Remover
                  </button>
                  <Modal
                    isOpen={modalRemovalState[subcategory.id] || false}
                    onClose={() => setModalRemovalState({})}
                    onConfirm={() => handleRemoveCategory(subcategory.id)}
                    title="Confirmação de Remoção"
                    message={`Tem certeza que deseja remover a categoria '${subcategory.name}'?`}
                    leading={`Atenção: Remover uma categoria também remove suas subcategorias.`}
                    option1="Remover"
                    option2="Cancelar"
                  />
                  <Modal
                    isOpen={modalErrorState[subcategory.id] || false}
                    onClose={() => setModalErrorState({})}
                    onConfirm={() => { setErrorMessage({ title: "", leading: "" }); setModalErrorState({}) }}
                    title="Remoção Inválida"
                    message={errorMessage.title}
                    leading={errorMessage.leading}
                    option1="Continuar"
                    confirm
                  />
                </div>
              }
            </div>
            {subcategory.subcategories && renderSubcategories(subcategory.subcategories)}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <ProtectedRoute isProtected>
      <BaseLayout>
        <div className="flex flex-col lg:flex-row flex-wrap items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Categorias</h1>
          <div className="flex flex-col lg:flex-row flex-wrap justify-center lg:justify-start gap-2 lg:gap-4 w-full lg:w-auto">
            <form className="flex w-full lg:w-auto" onSubmit={handleSubmit}>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Buscar Categoria"
                value={formData}
                onChange={(e) => setFormData(e.target.value)}
              />
              <button className="ml-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md" type="submit">
                Pesquisar
              </button>
            </form>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md" onClick={handleResetSearch}>
              Resetar Busca
            </button>
            {(user && user.is_superuser) &&
              <Link href="/categories/register" className="hover:bg-blue-600 hover:text-white border-2 border-blue-600 text-blue-600 transition duration-200 flex items-center justify-center font-bold py-2 px-4 md:px-8 rounded focus:outline-none focus:shadow-outline">
                Cadastrar Categoria
              </Link>
            }
          </div>
        </div>
        {message && <p className="text-red-600 font-semibold text-lg mb-2">{message}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
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