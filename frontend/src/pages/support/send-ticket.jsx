import Link from "next/link"
import BaseLayout from "../../components/shared/BaseLayout"
import ProtectedRoute from "@/components/routes/ProtectedRoute"
import { useState, useContext } from 'react'
import { AuthContext } from "@/contexts/authContext"
import { useRouter } from 'next/router'
import { getAdministrator } from "@/services/userService"
import { registerTicket } from "@/services/supportService"

export default function SendTicket() {

  const router = useRouter()
  const { user } = useContext(AuthContext)
  const [formData, setFormData] = useState({
    subject: "",
    content: "",
  })
  const [formErrors, setFormErrors] = useState({
    subject: "",
    content: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }))

    setFormErrors((prevErrors) => {
      const errors = { ...prevErrors }
      if (name === 'subject')
        errors.subject = ''
      if (name === 'content')
        errors.content = ''
      return errors
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (Object.values(formErrors).some(value => value !== ""))
      return

    try {
      const adminId = await getAdministrator()
      await registerTicket({
        subject: `${user.name}: ${formData.subject}`,
        content: formData.content,
        sender: user.id,
        recipient: adminId.id,
        answer: null
      })
      router.push('/support')
    } catch (e) {
      const errorObj = JSON.parse(e.message)
      setFormErrors(errorObj)
    }
    return
  }

  return (
    <ProtectedRoute isProtected>
      <BaseLayout>
        <h1 className="text-4xl font-bold text-slate-800 text-center lg:text-start mb-8">Abrir Ticket</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="subject" className="block text-base font-medium text-gray-700 mb-2">Assunto</label>
            <input 
              type="text" 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={handleChange}
              id="subject" 
              value={formData.subject}
              name="subject"
              required 
            />
            {formErrors.subject && <p className="mt-2 text-red-600">{formErrors.subject}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block text-base font-medium text-gray-700 mb-2">Conteúdo</label>
            <textarea
              rows={6}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={handleChange}
              id="content"
              value={formData.content}
              name="content"
              required
            ></textarea>
            {formErrors.content && <p className="mt-2 text-red-600">{formErrors.content}</p>}
          </div>
          <button type="submit" className="w-full md:w-auto px-6 py-3 rounded-md shadow-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            Enviar
          </button>
        </form>
        <hr className="mt-6 border border-gray-400" />
        <div className="mt-8 text-center">
          <p className="text-gray-700">
            Não precisa Enviar um Ticket ao nosso suporte? <Link href="/support" className="text-blue-600">Voltar para a Página de Suporte</Link>.
          </p>
        </div>
      </BaseLayout>
    </ProtectedRoute>
  )
}