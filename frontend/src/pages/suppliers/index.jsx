import Link from "next/link"
import BaseLayout from "@/components/shared/BaseLayout"
import ProtectedRoute from "@/components/routes/ProtectedRoute"
import { useEffect, useState } from 'react'
import { filterSuppliers, getSuppliers } from '@/services/supplierService'

export default function Suppliers() {
  
  const [suppliers, setSuppliers] = useState([])
  const [formData, setFormData] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const suppliers = await getSuppliers()
        if (suppliers.length === 0) {
          setMessage(`Ainda não existem fornecedores cadastradas.`)
        }
        setSuppliers(suppliers)
      } catch (e) {
        alert(e.message)
      }
    }

    fetchSuppliers()
  }, [])

  const handleResetSearch = async () => {
    try {
      const suppliers = await getSuppliers()
      setFormData("")
      setMessage("")
      if (suppliers.length === 0) {
        setMessage(`Ainda não existem fornecedores cadastrados.`)
      }
      setSuppliers(suppliers)
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
      const suppliers = await filterSuppliers(formData)
      if (suppliers.length === 0) {
        setMessage(`Nenhum resultado para a busca '${formData}'.`)
      }
      setSuppliers(suppliers)
    } catch (e) {
      alert(e.message)
    }
  }

  return (
    <ProtectedRoute isProtected isAdminOnly>
      <BaseLayout>
      <div className="flex flex-col lg:flex-row flex-wrap items-center justify-between mb-6">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">Fornecedores</h1>
        <div className="flex flex-col lg:flex-row flex-wrap justify-center lg:justify-start gap-2 lg:gap-4 w-full lg:w-auto">
          <form className="flex w-full lg:w-auto" onSubmit={handleSubmit}>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Buscar Fornecedor"
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
            <Link href="/suppliers/register" className="hover:bg-blue-600 hover:text-white border-2 border-blue-600 text-blue-600 transition duration-200 flex items-center justify-center font-bold py-2 px-4 md:px-8 rounded focus:outline-none focus:shadow-outline">
              Cadastrar Fornecedor
            </Link>
        </div>
        </div>
        {message && <p className="text-red-600 font-semibold text-lg mb-2">{message}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliers.map((supplier) => (
            <div key={supplier.id} className="bg-white rounded-lg overflow-hidden shadow">
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{supplier.name}</h2>
                <hr className="mb-4"/>
                <p className="text-gray-600 text-lg">
                  <span className="font-semibold">CNPJ:</span> {supplier.cnpj}
                </p>
                <p className="text-gray-600 text-lg">
                  <span className="font-semibold">Email:</span> {supplier.email}
                </p>
              </div>
              <Link href={`/suppliers/${supplier.id}`} className="block bg-blue-600 hover:bg-blue-700 p-3 text-xl text-white text-center">
                Ver detalhes
              </Link>
            </div>
          ))}
        </div>
      </BaseLayout>
    </ProtectedRoute>
  )
}