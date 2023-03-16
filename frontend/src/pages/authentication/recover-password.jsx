export default function RecoverPassword() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="mx-auto max-w-lg py-20">
        <div className="bg-white shadow-md rounded px-8 py-10">
          <h1 className="text-3xl text-gray-900 font-bold text-center mb-8">Recuperação de Conta</h1>
          <form>
          <div className="mb-2">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
                Senha
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="confirmPassword">
                Confirmar Senha ?????
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="confirmPassword"
                type="password"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Atualizar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
