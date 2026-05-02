import { z } from "zod";
import { COUNTRIES } from "../data/countries";
import { validatePrimaryCompanyIdentity } from "../data/companyIdentityRules";
import { getCountryCommercialDefaults } from "../data/countryCommercialRules";

const CUSTOMER_TYPES = ["business", "individual"];

const normaliseCustomerVatNumber = (raw) =>
  String(raw ?? "")
    .replace(/\s+/g, "")
    .trim()
    .toUpperCase();

export const customerSchema = z
  .object({
    customerType: z.enum(CUSTOMER_TYPES, {
      message: "Невалиден тип клиент.",
    }),
    customerName: z.string().trim().min(1, "Името на клиента е задължително."),
    customerCountry: z
      .string()
      .trim()
      .refine((v) => COUNTRIES.includes(v), "Изберете валидна държава."),
    companyIdentifier: z.string().trim().optional(),
    customerVatRegistered: z.boolean().default(false),
    customerVatNumber: z.string().trim().optional(),
    customerAddress: z.string().trim().optional(),
    customerPostCode: z.string().trim().optional(),
    customerCity: z.string().trim().optional(),
    customerEmail: z
      .string()
      .trim()
      .optional()
      .refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
        message: "Въведете валиден имейл адрес.",
      }),
  })
  .superRefine((data, ctx) => {
    if (data.customerType !== "business") return;

    const identityValidation = validatePrimaryCompanyIdentity(
      data.companyIdentifier ?? "",
      data.customerCountry,
    );
    if (!identityValidation.ok) {
      ctx.addIssue({
        code: "custom",
        message:
          identityValidation.message ||
          "Невалиден фирмен идентификатор за избраната държава.",
        path: ["companyIdentifier"],
      });
    }

    if (!data.customerVatRegistered) return;

    const vatNumber = normaliseCustomerVatNumber(data.customerVatNumber);
    if (!vatNumber) {
      ctx.addIssue({
        code: "custom",
        message: "Въведете ДДС номер.",
        path: ["customerVatNumber"],
      });
      return;
    }

    const { iso2 } = getCountryCommercialDefaults(data.customerCountry);
    const cc = (iso2 || "").toUpperCase();
    if (cc && !vatNumber.startsWith(cc)) {
      ctx.addIssue({
        code: "custom",
        message: `ДДС номерът трябва да започва с ${cc}.`,
        path: ["customerVatNumber"],
      });
    }
  });
