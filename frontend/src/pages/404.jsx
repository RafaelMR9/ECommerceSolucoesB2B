import BaseLayout from '@/components/shared/BaseLayout'
import EmptyState from '@/components/ui/EmptyState'
import Button from '@/components/ui/Button'
export default function NotFound() {
  return (
    <BaseLayout>
      <EmptyState
        heading="h1"
        title="Esta Página Não Foi Encontrada"
        description="O endereço pode ter mudado ou este conteúdo não está disponível."
        action={<Button href="/">Voltar ao Início</Button>}
      />
    </BaseLayout>
  )
}
