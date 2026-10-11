import BaseLayout from '@/components/shared/BaseLayout'
import EmptyState from '@/components/ui/EmptyState'
import Button from '@/components/ui/Button'
export default function ServerError() {
  return (
    <BaseLayout>
      <EmptyState
        title="Não Foi Possível Abrir Esta Página"
        description="Tente novamente em instantes."
        action={<Button href="/">Voltar ao Início</Button>}
      />
    </BaseLayout>
  )
}
