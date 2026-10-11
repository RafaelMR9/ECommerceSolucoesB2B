import BaseLayout from '@/components/shared/BaseLayout'
import EmptyState from '@/components/ui/EmptyState'
import Button from '@/components/ui/Button'
export default function NotFound() {
  return (
    <BaseLayout>
      <EmptyState
        title="Esta página não foi encontrada"
        description="O endereço pode ter mudado ou este conteúdo não está disponível."
        action={<Button href="/">Voltar ao início</Button>}
      />
    </BaseLayout>
  )
}
