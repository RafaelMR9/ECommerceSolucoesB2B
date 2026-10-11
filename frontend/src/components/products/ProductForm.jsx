import { useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Field from '@/components/ui/Field'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import { errorFields } from '@/lib/format'
import { registerProduct, updateProduct } from '@/services/productService'

const emptyProduct = {
  name: '',
  currentStockQuantity: '',
  costPrice: '',
  salePrice: '',
  description: '',
  packaging: '',
  category: '',
  supplier: '',
}
export default function ProductForm({ product, categories, suppliers }) {
  const router = useRouter()
  const [values, setValues] = useState(
    product
      ? Object.fromEntries(Object.keys(emptyProduct).map((key) => [key, product[key] ?? '']))
      : { ...emptyProduct }
  )
  const [image, setImage] = useState(null)
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const [success, setSuccess] = useState('')
  function change(event) {
    const { name, value } = event.target
    setValues((previous) => ({ ...previous, [name]: value }))
    setErrors((previous) => ({ ...previous, [name]: '' }))
  }
  async function submit(event) {
    event.preventDefault()
    if (busy) return
    setBusy(true)
    setErrors({})
    setSuccess('')
    try {
      const data = { ...values, ...(image ? { image } : {}) }
      if (product) {
        await updateProduct(data, product.id)
        await router.push(`/products/${product.id}`)
      } else {
        await registerProduct(data)
        setSuccess('Produto cadastrado com sucesso.')
        setValues({ ...emptyProduct })
        setImage(null)
        event.target.reset()
      }
    } catch (error) {
      setErrors(errorFields(error))
    } finally {
      setBusy(false)
    }
  }
  const field = (name, label, props = {}) => (
    <Field
      name={name}
      label={label}
      value={values[name] ?? ''}
      onChange={change}
      error={errors[name]}
      required
      {...props}
    />
  )
  return (
    <form className="form-panel" onSubmit={submit}>
      <Alert>{errors.detail || errors.non_field_errors}</Alert>
      <Alert variant="success">{success}</Alert>
      <div className="form-grid">
        <div className="form-wide">{field('name', 'Nome do produto')}</div>
        {field('currentStockQuantity', 'Quantidade em estoque', {
          type: 'number',
          min: 0,
          step: 1,
        })}
        {field('packaging', 'Unidades por embalagem', { type: 'number', min: 1, step: 1 })}
        {field('costPrice', 'Preço de custo (R$)', { type: 'number', min: 0.01, step: 0.01 })}
        {field('salePrice', 'Preço de venda (R$)', { type: 'number', min: 0.01, step: 0.01 })}
        {field('category', 'Categoria', {
          as: 'select',
          children: (
            <>
              <option value="">Selecione uma categoria</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </>
          ),
        })}
        {field('supplier', 'Fornecedor', {
          as: 'select',
          children: (
            <>
              <option value="">Selecione um fornecedor</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </>
          ),
        })}
        <div className="form-wide">
          {field('description', 'Descrição', { as: 'textarea', rows: 4 })}
        </div>
        <div className="form-wide">
          {product?.image && (
            <div className="relative h-32 w-40 mb-4">
              <Image
                src={product.image}
                alt="Imagem atual do produto"
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          )}
          <Field
            name="image"
            type="file"
            label={product ? 'Substituir imagem' : 'Imagem do produto'}
            accept="image/png,image/jpeg,image/webp"
            required={!product}
            error={errors.image}
            hint="PNG, JPEG ou WebP, até 4 MB."
            onChange={(event) => {
              const file = event.target.files[0]
              if (file?.size > 4 * 1024 * 1024) {
                setErrors((previous) => ({ ...previous, image: 'A imagem deve ter até 4 MB.' }))
                event.target.value = ''
                setImage(null)
              } else {
                setImage(file || null)
                setErrors((previous) => ({ ...previous, image: '' }))
              }
            }}
          />
        </div>
      </div>
      <div className="form-actions">
        <Button type="submit" disabled={busy}>
          {busy ? 'Salvando…' : product ? 'Salvar alterações' : 'Cadastrar produto'}
        </Button>
        <Button href={product ? `/products/${product.id}` : '/products'} variant="secondary">
          Cancelar
        </Button>
      </div>
    </form>
  )
}
