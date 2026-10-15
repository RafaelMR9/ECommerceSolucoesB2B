import { useState } from 'react'
import { useRouter } from 'next/router'
import AuthLayout from '@/components/shared/AuthLayout'
import Field from '@/components/ui/Field'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import { registerUser } from '@/services/authService'
import { validateEmail, validateCnpj, validatePassword } from '@/utils/utils'
import { errorFields } from '@/lib/format'
import { withSession } from '@/lib/server/page'
const fields = [
  ['name', 'Nome da organização', 'text'],
  ['cnpj', 'CNPJ', 'text'],
  ['email', 'E-mail', 'email'],
  ['address', 'Endereço', 'text'],
  ['username', 'Usuário', 'text'],
  ['password', 'Senha', 'password'],
  ['confirmPassword', 'Confirmar senha', 'password'],
]
export default function RegisterAccount() {
  const router = useRouter(),
    [values, setValues] = useState({
      name: '',
      cnpj: '',
      email: '',
      address: '',
      username: '',
      password: '',
      confirmPassword: '',
      authorizeFature: false,
    }),
    [errors, setErrors] = useState({}),
    [busy, setBusy] = useState(false)
  function change(e) {
    const { name, value, checked, type } = e.target
    setValues((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
    setErrors((p) => ({ ...p, [name]: '' }))
  }
  async function submit(e) {
    e.preventDefault()
    if (busy) return
    const validation = {}
    if (!validateEmail(values.email)) validation.email = 'Informe um e-mail válido.'
    if (!validateCnpj(values.cnpj)) validation.cnpj = 'Use o formato 00.000.000/0000-00.'
    if (!validatePassword(values.password))
      validation.password = 'Use pelo menos 8 caracteres, incluindo letras.'
    if (values.password !== values.confirmPassword)
      validation.confirmPassword = 'As senhas não coincidem.'
    if (Object.keys(validation).length) {
      setErrors(validation)
      return
    }
    setBusy(true)
    setErrors({})
    try {
      await registerUser(values)
      await router.push('/authentication')
    } catch (error) {
      setErrors(errorFields(error))
    } finally {
      setBusy(false)
    }
  }
  return (
    <AuthLayout
      title="Sua Organização Começa Aqui"
      description="Crie uma conta para realizar compras e acompanhar seus pedidos."
    >
      <form onSubmit={submit}>
        <Alert>{errors.detail || errors.non_field_errors}</Alert>
        {fields.map(([name, label, type]) => (
          <Field
            key={name}
            name={name}
            label={label}
            type={type}
            value={values[name]}
            onChange={change}
            error={errors[name]}
            autoComplete={
              type === 'password'
                ? 'new-password'
                : name === 'email'
                  ? 'email'
                  : name === 'username'
                    ? 'username'
                    : 'off'
            }
            placeholder={name === 'cnpj' ? '00.000.000/0000-00' : undefined}
            required
          />
        ))}
        <div className="flex gap-2.5 items-start mt-3.75 mr-0 mb-5.5 ml-0">
          <input
            className="accent-brand-accent w-4.5 h-4.5 mt-0.75"
            type="checkbox"
            name="authorizeFature"
            id="authorizeFature"
            checked={values.authorizeFature}
            onChange={change}
          />
          <label className="text-ui text-brand-ink" htmlFor="authorizeFature">
            Solicitar análise de crédito para compras faturadas
          </label>
        </div>
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? 'Criando Conta…' : 'Criar Minha Conta'}
        </Button>
        <div className="flex justify-between gap-3.75 items-center flex-wrap text-small my-4.5 mx-0">
          <span>Já tem uma conta?</span>
          <Button href="/authentication" variant="ghost">
            Entrar
          </Button>
        </div>
      </form>
    </AuthLayout>
  )
}
export const getServerSideProps = withSession(undefined, { authPage: true })
