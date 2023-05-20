import { useState } from 'react'
import Link from "next/link"
import BaseLayout from "@/components/shared/BaseLayout"

export default function RegisterProduct() {

  const [formData, setFormData] = useState({
    name: "",
    costPrice: "",
    salePrice: "",
    description: "",
    packaging: "",
    category: "",
    image: null,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    setFormData((prevFormData) => ({
      ...prevFormData,
      image: file,
    }))
  }

  const imagePreview = (e) => {
    const reader = new FileReader()
    reader.onload = () => {
      const preview = document.getElementById("imagePreview")
      preview.src = reader.result
    }
    reader.readAsDataURL(e.target.files[0])
  }

  return (
    <BaseLayout>
      <h1 className="text-4xl font-bold text-slate-800 mb-8">Cadastrar Produto</h1>
      <div className="grid grid-cols-2 gap-8">
        <form className="max-w-lg ">
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
              min={0}
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
              min={0}
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
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="category">
              Categoria
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="category"
              required
            >
              <option>Selecione uma categoria</option>
              <option value="1">Categoria 1</option>
              <option value="2">Categoria 2</option>
              <option value="3">Categoria 3</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="imageUpload" className="block text-gray-700 font-bold mb-2">
              Imagem
            </label>
            <input
              type="file"
              id="imageUpload"
              onChange={imagePreview}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-white"
              required
            />
          </div>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Cadastrar
          </button>
        </form>
        <div className="flex items-center justify-center">
          <div className="w-90 h-80 mx-auto mt-4">
            <img
              id="imagePreview"
              className="w-full h-full object-contain border-4 border-blue-600 rounded"
              src="https://dummyimage.com/150x150/000/fff"
              alt="Preview da Imagem"
            />
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
  )
}