import assert from 'node:assert/strict'
import test from 'node:test'
import { navigationLoading } from '../src/lib/navigation.js'

test('a troca de página usa o indicador de navegação', () => {
  assert.equal(navigationLoading('/', '/categories'), 'page')
  assert.equal(navigationLoading('/authentication', '/authentication/forgot-password'), 'page')
})

test('buscas e filtros atualizam somente os resultados da página atual', () => {
  assert.equal(navigationLoading('/products', '/products?fetchProduct=fone'), 'results')
  assert.equal(navigationLoading('/products?categoryId=1', '/products'), 'results')
  assert.equal(navigationLoading('/categories', '/categories?search=papel'), 'results')
  assert.equal(navigationLoading('/suppliers', '/suppliers?search=demo'), 'results')
  assert.equal(navigationLoading('/carriers?search=demo', '/carriers'), 'results')
})

test('repetir a URL atual não abre outro indicador', () => {
  assert.equal(
    navigationLoading('/products?fetchProduct=fone', '/products?fetchProduct=fone'),
    null
  )
})

test('atualizar pedidos após uma ação não abre o indicador geral', () => {
  assert.equal(
    navigationLoading('/orders/non-recurring-orders', '/orders/non-recurring-orders'),
    null
  )
  assert.equal(navigationLoading('/cart', '/cart'), null)
  assert.equal(navigationLoading('/analysis', '/analysis'), null)
})

test('mudar de produto na mesma rota ainda indica uma navegação', () => {
  assert.equal(navigationLoading('/purchase?productId=1', '/purchase?productId=2'), 'page')
})

test('âncoras e destinos externos não abrem um carregamento de página', () => {
  assert.equal(navigationLoading('/products#inicio', '/products#filtros'), null)
  assert.equal(navigationLoading('/profile', 'https://rafael-dev.vercel.app/'), null)
})
