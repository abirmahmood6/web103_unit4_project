const BASE_PRICE = 25000

export const calculateTotalPrice = (selectedOptions) => {
  const { exteriorColor, wheels, roof, engine } = selectedOptions

  let totalPrice = BASE_PRICE

  if (exteriorColor && exteriorColor.price) {
    totalPrice += parseFloat(exteriorColor.price)
  }

  if (wheels && wheels.price) {
    totalPrice += parseFloat(wheels.price)
  }

  if (roof && roof.price) {
    totalPrice += parseFloat(roof.price)
  }

  if (engine && engine.price) {
    totalPrice += parseFloat(engine.price)
  }

  return totalPrice
}

export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}