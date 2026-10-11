export async function apiRequest(url, method = 'GET', data) {
  const multipart = typeof FormData !== 'undefined' && data instanceof FormData
  const response = await fetch(url, {
    method,
    ...(data === undefined
      ? {}
      : {
          body: multipart ? data : JSON.stringify(data),
          ...(multipart ? {} : { headers: { 'Content-Type': 'application/json' } }),
        }),
  })
  const result = response.status === 204 ? null : await response.json().catch(() => null)
  if (!response.ok)
    throw new Error(JSON.stringify(result || { detail: 'Não foi possível concluir a ação.' }))
  return result
}
