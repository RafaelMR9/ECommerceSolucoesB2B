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
    (c) => !search || c.name.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR'))
  )
  return (
    <BaseLayout>
      <PageHeader
        title="Categorias"
        description="Explore os produtos por categoria e encontre o que sua organização precisa."
        actions={
          user.is_superuser && <Button href="/categories/register">Cadastrar categoria</Button>
        }
      />
      <form action="/categories" className="search-form mb-6">
        <input
          className="field-control max-w-md"
          name="search"
          type="search"
          defaultValue={search}
          aria-label="Buscar categorias"
          placeholder="Buscar categoria"
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
      <Alert>{error}</Alert>
      {matches.length ? (
        <CategoryTree
          categories={categories}
          search={search}
          admin={user.is_superuser}
          onRemove={setSelected}
        />
      ) : (
        <EmptyState title="Nenhuma categoria encontrada" />
      )}
      <Modal
        isOpen={Boolean(selected)}
        title="Remover categoria"
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
