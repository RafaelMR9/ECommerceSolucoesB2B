import assert from 'node:assert/strict'

const origin = process.env.UI_TEST_URL || 'http://127.0.0.1:3007'
const api = process.env.UI_TEST_API_URL || 'http://127.0.0.1:8010/api/'
for (const address of [origin, api])
  assert.ok(
    ['localhost', '127.0.0.1'].includes(new URL(address).hostname),
    'Use an isolated local database for these checks.'
  )
const users = {}
async function login(username) {
  const response = await fetch(`${origin}/api/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password: 'test-password' }),
  })
  assert.equal(response.status, 200, 'Fixture login must succeed')
  const data = await response.json()
  assert.ok(data.user)
  users[username] = data.user
  assert.ok(
    !data.access && !data.refresh && !data.user.password,
    'Credentials must not be sent in the session response'
  )
  const cookies = response.headers.getSetCookie()
  assert.ok(cookies.every((c) => c.includes('HttpOnly') && c.includes('SameSite=Lax')))
  return cookies.map((c) => c.split(';')[0]).join('; ')
}
const backendLogin = await fetch(`${api}users/token/`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'ui-review-admin', password: 'test-password' }),
})
assert.equal(backendLogin.status, 200, 'Backend fixture login must succeed')
const { access } = await backendLogin.json()
const backendRead = (path) => fetch(api + path, { headers: { Authorization: `Bearer ${access}` } })
const [products, categories, suppliers, carriers, tickets] = await Promise.all(
  ['products/', 'products/categories/', 'suppliers/', 'carriers/', 'support/'].map(async (path) =>
    (await backendRead(path)).json()
  )
)
const product = products[0],
  category = categories[0],
  supplier = suppliers[0],
  carrier = carriers[0],
  ticket = tickets[0]
const common = [
  '/',
  '/products',
  '/products?fetchProduct=not-a-product',
  '/categories',
  '/orders',
  '/orders/recurring-orders',
  '/orders/non-recurring-orders',
  '/profile',
  '/profile/update',
  '/support',
  '/support/send-ticket',
  '/cart',
]
const administrative = [
  '/products/register',
  '/categories/register',
  '/suppliers',
  '/suppliers/register',
  '/carriers',
  '/carriers/register',
  '/restock',
  '/analysis',
  '/payments',
  '/payments/recurring-payments',
  '/payments/non-recurring-payments',
  '/orders/adm-recurring-orders',
  '/orders/adm-non-recurring-orders',
  '/orders/suppliers-recurring-orders',
  '/orders/suppliers-non-recurring-orders',
]
if (product) {
  common.push(`/products/${product.id}`, `/purchase?productId=${product.id}`)
  administrative.push(
    `/products/update?productId=${product.id}`,
    `/products/register-promotion?productId=${product.id}`
  )
}
if (category) administrative.push(`/categories/update?categoryId=${category.id}`)
if (supplier)
  administrative.push(`/suppliers/${supplier.id}`, `/suppliers/update?supplierId=${supplier.id}`)
if (carrier)
  administrative.push(`/carriers/${carrier.id}`, `/carriers/update?carrierId=${carrier.id}`)
if (ticket) administrative.push(`/support/${ticket.id}`)
let checked = 0
const sessions = {}
for (const username of ['ui-review-admin', 'ui-review-buyer']) {
  const cookie = await login(username),
    admin = username.endsWith('admin')
  sessions[admin ? 'admin' : 'buyer'] = cookie
  const kind = admin ? 'Supplier' : 'Sales'
  const cartRead = async (path) => {
    const response = await fetch(`${origin}/api/backend/${path}`, { headers: { Cookie: cookie } })
    assert.equal(response.status, 200, 'The cart must be readable by its owner')
    return response.json()
  }
  const unfinished = await cartRead(
    `orders/${kind.toLowerCase()}Order/getUnfinished/?user=${users[username].id}`
  )
  const cartItems = unfinished.length
    ? await cartRead(`orders/item${kind}Order/${unfinished[0].id}/?user=${users[username].id}`)
    : []
  const expectedCount = cartItems.reduce((total, item) => total + Number(item.quantity), 0)
  for (const path of admin ? [...common, ...administrative] : common) {
    const response = await fetch(origin + path, { headers: { Cookie: cookie } })
    assert.equal(response.status, 200, `${username}: ${path}`)
    const html = await response.text()
    assert.equal(
      html.match(/<title[^>]*>(.*?)<\/title>/s)?.[1],
      'B2B Soluções · Sua Empresa em Movimento',
      `Shared site title: ${path}`
    )
    assert.ok(html.includes('B2B'), 'Page shell must render on the server')
    assert.ok(!/A plataforma está indisponível/i.test(html), path)
    assert.ok(!html.includes('"password":'), `No password/hash in SSR data: ${path}`)
    const pageData = JSON.parse(html.match(/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s)[1])
    if (path === '/') {
      assert.ok(
        pageData.props.pageProps.cards.length <= 8,
        'Home only sends displayed product cards'
      )
      assert.ok(
        pageData.props.pageProps.categories.length <= 4,
        'Home only sends displayed categories'
      )
    }
    assert.equal(
      pageData.props.pageProps.initialCartCount,
      expectedCount,
      `SSR cart count: ${path}`
    )
    assert.equal(
      html.includes('aria-label="Carrinho: '),
      expectedCount > 0,
      `Empty carts hide the badge: ${path}`
    )
    if (admin)
      assert.ok(
        html.indexOf('aria-label="Administração"') <
          html.indexOf('aria-label="Navegação Principal"'),
        'Administrative navigation precedes store links'
      )
    checked++
  }
  if (!admin)
    for (const path of administrative) {
      const response = await fetch(origin + path, {
        headers: { Cookie: cookie },
        redirect: 'manual',
      })
      assert.equal(
        response.status,
        path.startsWith('/support/')
          ? ticket.sender === users[username].id || ticket.recipient === users[username].id
            ? 200
            : 404
          : 307,
        `Buyer permissions for ${path}`
      )
      checked++
    }
  const detail = await fetch(origin + `/products/${product.id}`, { headers: { Cookie: cookie } })
  assert.ok(
    (await detail.text()).includes(product.name),
    'Product content must exist before JavaScript executes'
  )
}
for (const path of [
  '/authentication',
  '/authentication/register-account',
  '/authentication/forgot-password',
  '/authentication/recover-password?token=invalid',
]) {
  const response = await fetch(origin + path)
  assert.equal(response.status, 200, path)
  assert.equal(
    (await response.text()).match(/<title[^>]*>(.*?)<\/title>/s)?.[1],
    'B2B Soluções · Sua Empresa em Movimento',
    `Shared authentication title: ${path}`
  )
  checked++
}
const anonymous = await fetch(origin + '/profile', { redirect: 'manual' })
assert.equal(anonymous.status, 307)
const forged = await fetch(origin + '/profile', {
  headers: { Cookie: 'b2b_access=invalid' },
  redirect: 'manual',
})
assert.equal(forged.status, 307)
const crossSite = await fetch(origin + '/api/session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Origin: 'https://unrelated.example' },
  body: '{}',
})
assert.equal(crossSite.status, 403)
const anonymousProxy = await fetch(`${origin}/api/backend/products/`)
assert.equal(anonymousProxy.status, 401, 'Private proxy reads require a valid session')
const publicRegistration = await fetch(`${origin}/api/backend/users/register/`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: '{}',
})
assert.equal(
  publicRegistration.status,
  400,
  'Registration remains public and validates missing fields'
)
const publicResetCheck = await fetch(
  `${origin}/api/backend/users/passwordReset/checkExistence/?token=invalid`
)
assert.equal(publicResetCheck.status, 200, 'Password reset validation remains public')
assert.equal((await publicResetCheck.json()).status, false)
for (const path of [
  'users/admin_id',
  'users/user_id?email=missing%40example.invalid',
  'products/filterName?fetchProduct=not-a-product',
  'products/filterCategory?categoryId=' + category.id,
  'products/categories/filter?fetchCategories=not-a-category',
  'suppliers/filter?fetchSuppliers=not-a-supplier',
  'carriers/filter?fetchCarriers=not-a-carrier',
]) {
  const direct = await backendRead(path)
  const proxied = await fetch(`${origin}/api/backend/${path}`, {
    headers: { Cookie: sessions.admin },
    redirect: 'manual',
  })
  assert.equal(
    proxied.status,
    direct.status,
    `Legacy path is forwarded without a redirect: ${path}`
  )
  assert.deepEqual(
    await proxied.json(),
    await direct.json(),
    `Proxy preserves the response: ${path}`
  )
}
async function mutation(path, data, { admin = false, method = 'POST' } = {}) {
  const multipart = data instanceof FormData
  return fetch(`${origin}/api/backend/${path}`, {
    method,
    redirect: 'manual',
    headers: {
      Cookie: sessions[admin ? 'admin' : 'buyer'],
      ...(multipart ? {} : { 'Content-Type': 'application/json' }),
    },
    ...(data === undefined ? {} : { body: multipart ? data : JSON.stringify(data) }),
  })
}
const stocked = products.find((p) => p.currentStockQuantity > 0)
assert.ok(stocked, 'The local fixture database needs a product in stock')
const invalidImage = new FormData()
invalidImage.set(
  'image',
  new Blob([new Uint8Array(4 * 1024 * 1024)], { type: 'image/jpeg' }),
  'invalid-image.jpg'
)
const imageValidation = await mutation(`products/${stocked.id}/update/`, invalidImage, {
  admin: true,
  method: 'PATCH',
})
assert.equal(
  imageValidation.status,
  400,
  'Multipart overhead must not reject a 4 MB file in the proxy'
)
assert.ok((await imageValidation.json()).image, 'Django must still validate the image contents')
const readProduct = async () => (await backendRead(`products/${stocked.id}/detail/`)).json()
const original = await readProduct()
const oversizedImage = new FormData()
oversizedImage.set(
  'image',
  new Blob([new Uint8Array(5 * 1024 * 1024)], { type: 'image/jpeg' }),
  'oversized-image.jpg'
)
const oversizedRequest = await mutation(`products/${stocked.id}/update/`, oversizedImage, {
  admin: true,
  method: 'PATCH',
})
assert.equal(oversizedRequest.status, 413, 'The proxy rejects bodies over 5 MB')
assert.equal(
  (await readProduct()).image,
  original.image,
  'An oversized upload does not alter the product'
)
assert.equal((await mutation('orders/cart/add/', { product: stocked.id, quantity: 0 })).status, 400)
let added = await mutation('orders/cart/add/', { product: stocked.id, quantity: 1 })
assert.equal(added.status, 201)
const item = await added.json()
assert.equal((await readProduct()).currentStockQuantity, original.currentStockQuantity - 1)
for (const path of ['/cart', '/purchase/data']) {
  const response = await fetch(origin + path, { headers: { Cookie: sessions.buyer } })
  assert.equal(response.status, 200)
  const html = await response.text()
  if (path === '/cart') {
    assert.ok(html.includes(stocked.name), 'Cart products render on the server')
  } else {
    const { pageProps } = JSON.parse(
      html.match(/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s)[1]
    ).props
    assert.ok(html.includes('Finalizar Pedido') && html.includes('Entrega e Pagamento'))
    assert.ok(pageProps.items.some((entry) => entry.product === stocked.id))
    assert.ok(!('products' in pageProps), 'Checkout does not send the unused product catalog')
  }
}
assert.equal(
  (await mutation(`orders/cart/items/${item.id}/delete/`, undefined, { method: 'DELETE' })).status,
  204
)
assert.equal((await readProduct()).currentStockQuantity, original.currentStockQuantity)
added = await mutation('orders/cart/add/', { product: stocked.id, quantity: 1 })
assert.equal(added.status, 201)
const completed = await mutation('orders/checkout/', {
  deliveryDate: null,
  deliveryFrequency: null,
  faturedPayment: false,
})
assert.equal(completed.status, 200)
const { order } = await completed.json()
assert.equal(
  (await mutation(`orders/salesOrder/${order}/action/`, { action: 'prepare' })).status,
  403
)
assert.equal(
  (await mutation(`orders/salesOrder/${order}/action/`, { action: 'cancel' })).status,
  200
)
assert.equal(
  (await mutation(`orders/salesOrder/${order}/action/`, { action: 'cancel' })).status,
  400
)
assert.equal((await readProduct()).currentStockQuantity, original.currentStockQuantity)
const form = new FormData()
form.set('description', original.description)
const updated = await mutation(`products/${stocked.id}/update/`, form, {
  admin: true,
  method: 'PUT',
})
assert.equal(updated.status, 200)
const updatedProduct = await updated.json()
assert.equal(
  updatedProduct.description,
  original.description,
  'Multipart boundaries must not enter the product description'
)
assert.equal(
  updatedProduct.visible,
  original.visible,
  'An omitted multipart boolean must not hide the product'
)
assert.equal(updatedProduct.currentStockQuantity, original.currentStockQuantity)
assert.equal(updatedProduct.packaging, original.packaging)
assert.equal(
  updatedProduct.image,
  original.image,
  'Editing without uploading a replacement preserves the product image'
)
console.log(
  `Passed ${checked} page/permission checks, SSR content, HttpOnly cookies, invalid session, cross-site rejection, cart/checkout/cancellation and multipart image preservation.`
)
