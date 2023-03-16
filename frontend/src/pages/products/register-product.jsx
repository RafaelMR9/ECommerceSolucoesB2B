import Link from "next/link";
import BaseLayout from "../../components/shared/BaseLayout";

export default function RegisterProduct() {

  function imagePreview(e) {
    const reader = new FileReader();
    reader.onload = () => {
      const preview = document.getElementById("imagePreview");
      preview.src = reader.result;
    }
    reader.readAsDataURL(e.target.files[0]);
  }

  return (
    <BaseLayout>
      <h1 class="text-4xl font-bold text-slate-800 mb-8">Cadastrar Produto</h1>
      <div class="grid grid-cols-2 gap-8">
        <form class="max-w-lg ">
          <div class="mb-4">
            <label class="block text-gray-700 font-bold mb-2" htmlFor="name">
              Nome
            </label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Nome do Produto"
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 font-bold mb-2" htmlFor="costPrice">
              Preço de Custo
            </label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="costPrice"
              type="number"
              placeholder="Preço de Custo do Produto"
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 font-bold mb-2" htmlFor="salePrice">
              Preço de Venda
            </label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="salePrice"
              type="number"
              placeholder="Preço de Venda do Produto"
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 font-bold mb-2" htmlFor="description">
              Descrição
            </label>
            <textarea
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              placeholder="Descrição do Produto"
            ></textarea>
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 font-bold mb-2" htmlFor="packaging">
              Unidades por Embalagem
            </label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="packaging"
              type="number"
              placeholder="Unidades por Embalagem do Produto"
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 font-bold mb-2" htmlFor="category">
              Categoria
            </label>
            <select
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="category"
            >
              <option>Selecione uma categoria</option>
              <option value="1">Categoria 1</option>
              <option value="2">Categoria 2</option>
              <option value="3">Categoria 3</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="imageUpload" className="block text-gray-700 font-bold mb-2">
              Imagem ?????
            </label>
            <input
              type="file"
              id="imageUpload"
              onChange={imagePreview}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-white"
            />
          </div>
          <button
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Cadastrar
          </button>
        </form>
        <div class="flex items-center justify-center">
          <div class="w-90 h-80 mx-auto mt-4">
            <img
              id="imagePreview"
              class="w-full h-full object-contain border-4 border-blue-600 rounded"
              src="https://dummyimage.com/150x150/000/fff"
              alt="Preview da Imagem"
            />
          </div>
        </div>
      </div>
      <hr className="my-4 border border-gray-400"/>
      <div className="mt-8 text-center">
        <p className="text-gray-700">
          Não quer Cadastrar um Produto? <Link href="/products" className="text-blue-600">Voltar para a Página de Produtos</Link>.
        </p>
      </div>
    </BaseLayout>
  )
}