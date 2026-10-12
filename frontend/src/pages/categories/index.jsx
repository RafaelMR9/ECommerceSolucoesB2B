import Input from '@/components/ui/Input'
import { useContext, useState } from 'react'
import BaseLayout from '@/components/shared/BaseLayout'
import PageHeader from '@/components/ui/PageHeader'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import EmptyState from '@/components/ui/EmptyState'
import Modal from '@/components/shared/Modal'
import CategoryTree from '@/components/categories/CategoryTree'
import { AuthContext } from '@/contexts/authContext'
import { getCategories, removeCategory } from '@/services/productService'
import { errorFields } from '@/lib/format'
import { categorySearchText } from '@/lib/categories'
import { withSession } from '@/lib/server/page'
export default function Categories({ categories: initialCategories, search }) {
  const { user } = useContext(AuthContext),
    [categories, setCategories] = useState(initialCategories),
    [selected, setSelected] = useState(null),
    [error, setError] = useState('')
  async function remove() {
    try {
      await removeCategory(selected.id)
      setCategories(await getCategories())
    } catch (e) {
      setError(Object.values(errorFields(e)).join(' '))
    } finally {
      setSelected(null)
    }
  }
  const matches = categories.filter(
    (c) => !search || categorySearchText(c.name).includes(categorySearchText(search))
  )
  return (
    <BaseLayout>
      <PageHeader
        title="Categorias"
        eyebrow="Explore por Assunto"
        description="Explore os produtos por categoria e encontre o que sua organização precisa."
        actions={
          user.is_superuser && <Button href="/categories/register">Cadastrar Categoria</Button>
        }
      />
      <div className="flex items-center justify-between gap-5 flex-wrap mb-[25px]">
        <form
          action="/categories"
          className="flex flex-wrap gap-2 items-center min-w-0 flex-[1_1_400px] max-w-[650px]"
        >
          <Input
            className="duration-150 min-w-0 flex-[1_1_180px] max-w-md"
            name="search"
            type="search"
            defaultValue={search}
            aria-label="Buscar Categorias"
            placeholder="Buscar Categoria"
          />
          <Button type="submit" variant="secondary">
            Pesquisar
          </Button>
          {search && (
            <Button href="/categories" variant="ghost">
              Limpar
            </Button>
          )}
        </form>
        <p className="text-small text-brand-muted">
          {categories.length} Categorias · Abra os Grupos para Explorar
        </p>
      </div>
      <Alert>{error}</Alert>
      {matches.length ? (
        <CategoryTree
          categories={categories}
          search={search}
          admin={user.is_superuser}
          onRemove={setSelected}
        />
      ) : (
        <EmptyState title="Nenhuma Categoria Encontrada" />
      )}
      <Modal
        isOpen={Boolean(selected)}
        title="Remover Categoria"
        message={`Deseja remover “${selected?.name}”?`}
        leading="As subcategorias também serão removidas. Categorias com produtos relacionados não podem ser removidas."
        option1="Remover"
        option2="Cancelar"
        onClose={() => setSelected(null)}
        onConfirm={remove}
      />
    </BaseLayout>
  )
}
export const getServerSideProps = withSession(async ({ api, query }) => ({
  categories: await api('products/categories/'),
  search: typeof query.search === 'string' ? query.search : '',
}))
