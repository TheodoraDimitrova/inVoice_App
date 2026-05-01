import { z } from "zod";

export function createProductSchema() {
  return z.object({
    name: z.string().trim().min(1, "Името е задължително."),
    itemQuantity: z.coerce
      .number()
      .gt(0, "Количеството трябва да е по-голямо от 0."),
    itemUnit: z.string().trim().min(1, "Единицата е задължителна."),
    priceNet: z.coerce.number().gt(0, "Ед. цена е задължителна."),
  });
}
