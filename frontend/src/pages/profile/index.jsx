import BaseLayout from "../../components/shared/BaseLayout";

export default function Profile() {
  return (
    <BaseLayout>
      <h1 className="text-3xl font-bold text-slate-800 mb-8">
        Meu Perfil
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4">CNPJ</h2>
          <p className="text-gray-600">00.000.000/0001-00</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Endereço</h2>
          <p className="text-gray-600">Rua Exemplo, 123</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4">E-Mail</h2>
          <p className="text-gray-600">exemplo@exemplo.com</p>
        </div>
      </div>
    </BaseLayout>
  )
}