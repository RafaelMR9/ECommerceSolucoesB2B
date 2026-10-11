import { useState } from 'react'
import { useRouter } from 'next/router'
import { registerCategory, updateCategory, getCategories } from '@/services/productService'
import Field from '@/components/ui/Field'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import { errorFields } from '@/lib/format'

export default function CategoryForm({ category, categories: initialCategories }) {
  const router = useRouter()
  const [categories, setCategories] = useState(initialCategories)
  const [values, setValues] = useState({
    name: category?.name || '',
    subCategory: category?.category ?? '',
  })
  const [error, setError] = useState(''),
    [success, setSuccess] = useState(''),
    [busy, setBusy] = useState(false)
  function change(e) {
    setValues((p) => ({ ...p, [e.target.name]: e.target.value }))
    setError('')
  }
  function canBeParent(candidate) {
    let parent = candidate
    const visited = new Set()
    while (parent) {
      if (parent.id === category?.id || visited.has(parent.id)) return false
      visited.add(parent.id)
      parent = categories.find((c) => c.id === parent.category)
    }
    return true
  }
  async function submit(e) {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setError('')
    setSuccess('')
    try {
      if (category) {
        await updateCategory(values, category.id)
        await router.push('/categories')
      } else {
        await registerCategory(values)
        setCategories(await getCategories())
        setSuccess('Categoria cadastrada com sucesso.')
        setValues({ name: '', subCategory: '' })
      }
    } catch (e) {
      setError(Object.values(errorFields(e)).join(' '))
    } finally {
      setBusy(false)
    }
  }
  return (
    <form className="form-panel" onSubmit={submit}>
      <Alert>{error}</Alert>
      <Alert variant="success">{success}</Alert>
      <Field name="name" label="Nome da categoria" value={values.name} onChange={change} required />
      <Field
        name="subCategory"
        label="Categoria principal"
        as="select"
        value={values.subCategory}
        onChange={change}
        hint="Deixe em branco para criar uma categoria independente."
      >
        <option value="">Sem categoria principal</option>
        {categories.filter(canBeParent).map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </Field>
      <div className="form-actions">
        <Button type="submit" disabled={busy}>
          {busy ? 'Salvando…' : category ? 'Salvar alterações' : 'Cadastrar categoria'}
        </Button>
        <Button href="/categories" variant="secondary">
          Cancelar
        </Button>
      </div>
    </form>
  )
}
