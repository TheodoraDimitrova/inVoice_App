export function toProductPayload({
  name,
  itemQuantity,
  itemUnit,
  priceNet,
}) {
  return {
    name,
    price: priceNet,
    unit: itemUnit,
    quantityDefault: itemQuantity,
  };
}
