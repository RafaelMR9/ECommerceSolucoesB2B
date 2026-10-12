// Prepare only the data displayed by each card, before sending the page to the browser.
export function productCards(products, categories, promotions, now) {
  const categoriesById = new Map(categories.map((category) => [category.id, category]))
  const promotionsByProduct = new Map()
  for (const promotion of promotions) {
    if (
      !promotionsByProduct.has(promotion.product) &&
      new Date(promotion.startDate).getTime() <= now &&
      new Date(promotion.endDate).getTime() >= now
    ) {
      promotionsByProduct.set(promotion.product, promotion)
    }
  }
  return products.map(({ id, name, image, packaging, salePrice, category }) => {
    const promotion = promotionsByProduct.get(id)
    return {
      product: { id, name, image: image || null, packaging, salePrice },
      categoryName: categoriesById.get(category)?.name || null,
      promotion: promotion ? { salePrice: promotion.salePrice } : null,
    }
  })
}
