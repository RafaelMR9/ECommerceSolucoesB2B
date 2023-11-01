import BaseLayout from "@/components/shared/BaseLayout"
import ProtectedRoute from "@/components/routes/ProtectedRoute"
import Link from "next/link"
import Modal from "@/components/shared/Modal"
import { useState, useEffect } from "react"
import { getSupplier, removeSupplier } from "@/services/supplierService"
import { useRouter } from "next/router"
import { getProducts } from "@/services/productService"

export default function Supplier() {
  
  const router = useRouter()
  const { supplierId } = router.query
  const [supplier, setSupplier] = useState({})
  const [products, setProducts] = useState([])
  const [modalRemovalState, setModalRemovalState] = useState(false)
  const [modalErrorState, setModalErrorState] = useState(false)
  const [errorMessage, setErrorMessage] = useState({
    title: "",
    leading: ""
  })


  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const supplier = await getSupplier(supplierId)
        setSupplier(supplier)
      } catch (e) {
        router.push('/suppliers')
      }
    }

    const fetchProducts = async () => {
      try {
        const products = await getProducts()
        setProducts(products)
      } catch (e) {
        alert(e.message)
      }
    }

    fetchSupplier()
    fetchProducts()
  }, [])

  const handleRemoveSupplier = async (supplier) => {
    try {
      await removeSupplier(supplier)
      router.push('/suppliers')
    } catch (e) {
      const objError = JSON.parse(e.message)
      setErrorMessage({ 
        title: objError.title,
        leading: objError.leading
      })
      setModalRemovalState({})
      setModalErrorState({ [supplierId]: true })
    }
  }

  return (
    <ProtectedRoute isProtected isAdminOnly>
      <BaseLayout>
        <div className="flex flex-wrap justify-between items-center mb-2">
          <h1 className="text-4xl font-bold text-slate-800 ">{supplier.name}</h1>
            <button
              onClick={() => setModalRemovalState({ [supplierId]: true })}
              className="ml-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-8 rounded">
              Remover Fornecedor
            </button>
            <Modal
              isOpen={modalRemovalState[supplierId] || false}
              onClose={() => setModalRemovalState({})}
              onConfirm={() => handleRemoveSupplier(supplierId)}
              title="Confirmação de Remoção"
              message={`Tem certeza que deseja remover o fornecedor '${supplier.name}'?`}
              option1="Remover"
              option2="Cancelar"
            />
            <Modal
              isOpen={modalErrorState[supplierId] || false}
              onClose={() => setModalErrorState({})}
              onConfirm={() => {setErrorMessage({title: "", leading: ""}); setModalErrorState({})}}
              title="Remoção Inválida"
              message={errorMessage.title}
              leading={errorMessage.leading}
              option1="Continuar"
              confirm
            />
        </div>
        <hr className="border-gray-400 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col justify-between">
            <div className="text-lg">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Informações do Fornecedor</h2>
              <div className="bg-white rounded shadow p-4 mb-4">
                <p className="text-gray-600 font-semibold">CNPJ:</p>
                <p className="text-gray-800">{supplier.cnpj}</p>
              </div>
              <div className="bg-white rounded shadow p-4 mb-4">
                <p className="text-gray-600 font-semibold">Nome:</p>
                <p className="text-gray-800">{supplier.name}</p>
              </div>
              <div className="bg-white rounded shadow p-4 mb-4">
                <p className="text-gray-600 font-semibold">Email:</p>
                <p className="text-gray-800">{supplier.email}</p>
              </div>
          </div>
          <Link href={`/suppliers/update?supplierId=${supplierId}`} className="w-96 text-center bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold py-4 px-16 rounded focus:outline-none focus:shadow-outline">
            Atualizar Fornecedor
          </Link>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Produtos Relacionados</h2>
            {products
              .filter((product) => product.supplier === supplier.id)
              .map((product) => (
              <div key={product.id} className="mb-6 flex justify-between items-center text-lg">
                <div>
                  <p className="text-gray-600 font-semibold">Nome do Produto:</p>
                  <p className="text-gray-800">{product.name}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-semibold">Preço de Venda:</p>
                  <p className="text-gray-800">R$ {(product.salePrice).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-semibold">Quantidade em Estoque:</p>
                  <p className="text-gray-800">{product.currentStockQuantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </BaseLayout>
    </ProtectedRoute>
  )
}