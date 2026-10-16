import FormActions from '@/components/ui/FormActions'
import FormPanel from '@/components/ui/FormPanel'
import { useState } from 'react'
import { Boxes, ImagePlus, Package } from 'lucide-react'
import FormLayout from '@/components/ui/FormLayout'
import FormSection from '@/components/ui/FormSection'
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
  const [values, setValues] = useState(() => {
    const initialValues = { ...emptyProduct }
    if (product) {
      for (const key of Object.keys(initialValues)) {
        initialValues[key] = product[key] ?? ''
      }
    }
    return initialValues
  })
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
      const data = { ...values }
      if (image) data.image = image
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
      tone="tinted"
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
    <FormLayout
      icon={Package}
      title="Produtos com Informações Completas"
      description="Uma apresentação clara facilita a escolha e a organização das compras."
      points={[
        { title: 'Identificação', text: 'Descreva o produto e escolha sua categoria.' },
        {
          title: 'Embalagens e Preços',
          text: 'Informe as unidades por embalagem, estoque, custo e venda.',
        },
        { title: 'Apresentação', text: 'Associe o fornecedor e use uma imagem nítida do produto.' },
      ]}
    >
      <FormPanel wide onSubmit={submit}>
        <Alert>{errors.detail || errors.non_field_errors}</Alert>
        <Alert variant="success">{success}</Alert>
        <FormSection
          icon={Package}
          title="Informações do Produto"
          description="Nome, categoria e descrição para o catálogo."
        >
          {field('name', 'Nome do Produto')}
          {field('category', 'Categoria', {
            as: 'select',
            children: (
              <>
                <option value="">Selecione uma Categoria</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </>
            ),
          })}
          {field('description', 'Descrição', { as: 'textarea', rows: 4 })}
        </FormSection>
        <FormSection
          separated
          icon={Boxes}
          title="Estoque e Preços"
          description="Os preços se referem a cada embalagem."
        >
          <div className="grid grid-cols-2 gap-y-0 gap-x-5.5 max-[640px]:grid-cols-1">
            {field('currentStockQuantity', 'Quantidade em Estoque', {
              type: 'number',
              min: 0,
              step: 1,
            })}
            {field('packaging', 'Unidades por Embalagem', { type: 'number', min: 1, step: 1 })}
            {field('costPrice', 'Preço de Custo (R$)', { type: 'number', min: 0.01, step: 0.01 })}
            {field('salePrice', 'Preço de Venda (R$)', { type: 'number', min: 0.01, step: 0.01 })}
          </div>
        </FormSection>
        <FormSection
          separated
          icon={ImagePlus}
          title="Fornecedor e Imagem"
          description="Identifique a origem e a apresentação do produto."
        >
          {field('supplier', 'Fornecedor', {
            as: 'select',
            children: (
              <>
                <option value="">Selecione um Fornecedor</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </>
            ),
          })}
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
            tone="tinted"
            name="image"
            type="file"
            label={product ? 'Substituir Imagem' : 'Imagem do Produto'}
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
        </FormSection>
        <FormActions>
          <Button type="submit" disabled={busy}>
            {busy ? 'Salvando…' : product ? 'Salvar Alterações' : 'Cadastrar Produto'}
          </Button>
          <Button href={product ? `/products/${product.id}` : '/products'} variant="secondary">
            Cancelar
          </Button>
        </FormActions>
      </FormPanel>
    </FormLayout>
  )
}
