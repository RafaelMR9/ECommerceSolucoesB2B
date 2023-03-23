import Link from "next/link";
import BaseLayout from "../../components/shared/BaseLayout";

export default function Profile() {
  return (
    <BaseLayout>
      <h1 className="text-3xl font-bold text-slate-800 mb-8">
        Meu Perfil
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="max-w-sm rounded overflow-hidden shadow-lg">
          <div class="h-24 bg-blue-600"/>
          <div class="flex flex-col justify-center items-center px-6 py-4">
            <div class="text-lg font-bold text-slate-800 mb-2">CNPJ</div>
            <p class="text-gray-700 text-base">
              42.978.452/0001-92
            </p>
          </div>
        </div>
        <div class="max-w-sm rounded overflow-hidden shadow-lg">
          <div class="h-24 bg-blue-600"/>
          <div class="flex flex-col justify-center items-center px-6 py-4">
            <div class="text-lg font-bold text-slate-800 mb-2">Endereço</div>
            <p class="text-gray-700 text-base">
              Rua tal tal tal tal
            </p>
          </div>
        </div>
        <div class="max-w-sm rounded overflow-hidden shadow-lg">
          <div class="h-24 bg-blue-600"/>
          <div class="flex flex-col justify-center items-center px-6 py-4">
            <div class="text-lg font-bold text-slate-800 mb-2">E-Mail</div>
            <p class="text-gray-700 text-base">
              exemplo@gmail.com
            </p>
          </div>
        </div>
      </div>
      <hr className="my-16 border- border-gray-400"/>
      <div className="flex justify-around items-center">
          <Link href="/profile/update" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded focus:outline-none focus:shadow-outline">
            Editar Dados de Cadastro
          </Link>
          <Link href="/auth" className="hover:bg-white border-2 border-red-600 text-red-600 font-bold py-4 px-16 rounded focus:outline-none focus:shadow-outline">
            Sair
          </Link>
      </div>
    </BaseLayout>
  )
}