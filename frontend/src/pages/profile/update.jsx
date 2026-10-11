import { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import BaseLayout from '@/components/shared/BaseLayout'
import PageHeader from '@/components/ui/PageHeader'
import Button from '@/components/ui/Button'
import Field from '@/components/ui/Field'
import Alert from '@/components/ui/Alert'
import { AuthContext } from '@/contexts/authContext'
import { updateUser } from '@/services/userService'
import { validateEmail, validateCpf, validateCnpj } from '@/utils/utils'
import { errorFields } from '@/lib/format'
import { withSession } from '@/lib/server/page'
export default function UpdateProfile() {
  const { user, setUser } = useContext(AuthContext),
    router = useRouter()
  const [values, setValues] = useState({
      email: user.email,
      cpf: user.cpf || '',
      cnpj: user.cnpj || '',
      address: user.address || '',
      name: user.name || '',
    }),
    [errors, setErrors] = useState({}),
    [busy, setBusy] = useState(false)
  const fields = user.is_superuser
    ? [
        ['cpf', 'CPF', 'text'],
        ['email', 'E-mail', 'email'],
      ]
    : [
        ['name', 'Nome da organização', 'text'],
        ['cnpj', 'CNPJ', 'text'],
        ['address', 'Endereço', 'text'],
        ['email', 'E-mail', 'email'],
      ]
  function change(e) {
    setValues((p) => ({ ...p, [e.target.name]: e.target.value }))
    setErrors((p) => ({ ...p, [e.target.name]: '' }))
  }
  async function submit(e) {
    e.preventDefault()
    if (busy) return
    const validation = {}
    if (!validateEmail(values.email)) validation.email = 'Informe um e-mail válido.'
    if (user.is_superuser && !validateCpf(values.cpf))
      validation.cpf = 'Use o formato 000.000.000-00.'
    if (!user.is_superuser && !validateCnpj(values.cnpj))
      validation.cnpj = 'Use o formato 00.000.000/0000-00.'
    if (Object.keys(validation).length) {
      setErrors(validation)
      return
    }
    setBusy(true)
    try {
      const data = await updateUser(
        {
          ...values,
          cpf: user.is_superuser ? values.cpf : null,
          cnpj: user.is_superuser ? null : values.cnpj,
          name: user.is_superuser ? null : values.name,
          address: user.is_superuser ? null : values.address,
        },
        user.id,
        user.username
      )
      setUser({ ...user, ...data })
      await router.push('/profile')
    } catch (error) {
      setErrors(errorFields(error))
    } finally {
      setBusy(false)
    }
  }
  return (
    <BaseLayout>
      <PageHeader
        title="Editar cadastro"
        description="Mantenha seus dados atualizados."
        back={{ href: '/profile', label: 'Minha conta' }}
      />
      <form className="form-panel" onSubmit={submit}>
        <Alert>{errors.detail}</Alert>
        {fields.map(([name, label, type]) => (
          <Field
            key={name}
            name={name}
            label={label}
            type={type}
            value={values[name]}
            onChange={change}
            error={errors[name]}
            required
          />
        ))}
        <div className="form-actions">
          <Button type="submit" disabled={busy}>
            {busy ? 'Salvando…' : 'Salvar alterações'}
          </Button>
          <Button href="/profile" variant="secondary">
            Cancelar
          </Button>
        </div>
      </form>
    </BaseLayout>
  )
}
export const getServerSideProps = withSession()
