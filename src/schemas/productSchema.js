import { z } from "zod";

export const DEFAULT_PRODUCT_VAT_OPTIONS = [20, 9, 0];

export function createProductSchema({
  isBusinessVatRegistered = true,
  vatOptions = DEFAULT_PRODUCT_VAT_OPTIONS,
} = {}) {
  return z.object({
    itemName: z.string().trim().min(1, "Името е задължително."),
    itemQuantity: z.coerce
      .number()
      .gt(0, "Количеството трябва да е по-голямо от 0."),
    itemUnit: z.string().trim().min(1, "Единицата е задължителна."),
    itemCost: z.coerce.number().gt(0, "Ед. цена е задължителна."),
    itemVatRate: z.coerce
      .number()
      .refine(
        (value) =>
          isBusinessVatRegistered ? vatOptions.includes(value) : value === 0,
        "Невалидна ДДС ставка."
      ),
  });
}
