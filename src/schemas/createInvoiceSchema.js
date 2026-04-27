import { z } from "zod";
import { COUNTRIES } from "../data/countries";
import { validatePrimaryCompanyIdentity } from "../data/companyIdentityRules";
import { getCountryCommercialDefaults } from "../data/countryCommercialRules";

const CUSTOMER_TYPES = ["business", "individual"];
const CURRENCY_OPTIONS = ["EUR", "BGN", "USD", "GBP"];
const parseLocaleNumber = (value) => {
  const normalized = String(value ?? "")
    .trim()
    .replace(/\s+/g, "")
    .replace(",", ".");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : 0;
};
const invoiceItemSchema = z.object({
  itemName: z.string().min(1, "Името е задължително"),

  itemUnit: z.string().optional(),

  itemCost: z.coerce.number().nonnegative(),

  itemQuantity: z.coerce.number().positive(),

  itemVatRate: z.union([z.literal(0), z.literal(9), z.literal(20)]).default(20),
  itemDiscountPercent: z.coerce.number().nonnegative().optional(),
  itemDiscountAmount: z.coerce.number().nonnegative().optional(),
  itemDiscount: z.coerce.number().nonnegative().optional(),
});
const normaliseCustomerVatNumber = (raw) =>
  String(raw ?? "")
    .replace(/\s+/g, "")
    .trim()
    .toUpperCase();

export const createInvoiceSchema = z
  .object({
    customerType: z.enum(CUSTOMER_TYPES, {
      message: "Невалиден тип клиент.",
    }),
    issueDate: z.string().trim().min(1, "Датата на издаване е задължителна."),
    dueDate: z.string().trim().optional(),
    currency: z
      .string()
      .trim()
      .toUpperCase()
      .refine((v) => CURRENCY_OPTIONS.includes(v), "Изберете валидна валута."),
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
    includeInvoiceNote: z.boolean().default(false),
    invoiceNote: z.string().trim().optional(),
    customerEmail: z
      .string()
      .trim()
      .optional()
      .refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
        message: "Въведете валиден имейл адрес.",
      }),
    itemList: z.array(invoiceItemSchema).default([]),
  })
  .superRefine((data, ctx) => {
    if (data.customerType === "business") {
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

      if (data.customerVatRegistered) {
        const vatNumber = normaliseCustomerVatNumber(data.customerVatNumber);
        if (!vatNumber) {
          ctx.addIssue({
            code: "custom",
            message: "Въведете ДДС номер.",
            path: ["customerVatNumber"],
          });
        } else {
          const { iso2 } = getCountryCommercialDefaults(data.customerCountry);
          const cc = (iso2 || "").toUpperCase();
          if (cc && !vatNumber.startsWith(cc)) {
            ctx.addIssue({
              code: "custom",
              message: `ДДС номерът трябва да започва с ${cc}.`,
              path: ["customerVatNumber"],
            });
          }
        }
      }
    }

    const issue = new Date(data.issueDate);
    const dueRaw = (data.dueDate ?? "").trim();
    if (dueRaw) {
      const due = new Date(dueRaw);
      if (
        !Number.isNaN(issue.getTime()) &&
        !Number.isNaN(due.getTime()) &&
        due < issue
      ) {
        ctx.addIssue({
          code: "custom",
          message: "Падежът не може да е преди датата на издаване.",
          path: ["dueDate"],
        });
      }
    }
    if (data.includeInvoiceNote && !String(data.invoiceNote || "").trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Добавете текст за забележката.",
        path: ["invoiceNote"],
      });
    }

    const rows = Array.isArray(data.itemList) ? data.itemList : [];
    let hasAtLeastOneValidRow = false;
    rows.forEach((row, idx) => {
      const name = String(row?.itemName || "").trim();
      const unit = String(row?.itemUnit || "").trim();
      const cost = parseLocaleNumber(row?.itemCost);
      const qty = parseLocaleNumber(row?.itemQuantity);
      const vat = parseLocaleNumber(row?.itemVatRate);
      const hasInput =
        name !== "" || unit !== "" || cost > 0 || qty > 0 || vat > 0;
      const isComplete = name !== "" && unit !== "" && cost > 0 && qty >= 1;

      if (isComplete) hasAtLeastOneValidRow = true;

      if (hasInput && !isComplete) {
        if (!name) {
          ctx.addIssue({
            code: "custom",
            message: "Името е задължително.",
            path: ["itemList", idx, "itemName"],
          });
        }
        if (!unit) {
          ctx.addIssue({
            code: "custom",
            message: "Единицата е задължително поле.",
            path: ["itemList", idx, "itemUnit"],
          });
        }
        if (!(cost > 0)) {
          ctx.addIssue({
            code: "custom",
            message: "Ед. цена е задължително поле.",
            path: ["itemList", idx, "itemCost"],
          });
        }
        if (!(qty >= 1)) {
          ctx.addIssue({
            code: "custom",
            message: "Количеството трябва да е >= 1.",
            path: ["itemList", idx, "itemQuantity"],
          });
        }
      }

      const discountPercent = parseLocaleNumber(
        row?.itemDiscountPercent ?? row?.itemDiscount,
      );
      const discountAmount = parseLocaleNumber(row?.itemDiscountAmount);
      if (discountPercent > 0 && discountAmount > 0) {
        ctx.addIssue({
          code: "custom",
          message: "Изберете само един тип отстъпка: % или сума.",
          path: ["itemList", idx, "itemDiscountPercent"],
        });
        ctx.addIssue({
          code: "custom",
          message: "Изберете само един тип отстъпка: % или сума.",
          path: ["itemList", idx, "itemDiscountAmount"],
        });
      }
    });

    if (!hasAtLeastOneValidRow) {
      ctx.addIssue({
        code: "custom",
        message: "Добавете поне един продукт или услуга.",
        path: ["itemList"],
      });
      if (rows.length) {
        const first = rows[0] || {};
        const firstName = String(first?.itemName || "").trim();
        const firstUnit = String(first?.itemUnit || "").trim();
        const firstCost = parseLocaleNumber(first?.itemCost);
        const firstQty = parseLocaleNumber(first?.itemQuantity);
        if (!firstName) {
          ctx.addIssue({
            code: "custom",
            message: "Името е задължително.",
            path: ["itemList", 0, "itemName"],
          });
        }
        if (!firstUnit) {
          ctx.addIssue({
            code: "custom",
            message: "Единицата е задължителна.",
            path: ["itemList", 0, "itemUnit"],
          });
        }
        if (!(firstCost > 0)) {
          ctx.addIssue({
            code: "custom",
            message: "Ед. цена е задължителна.",
            path: ["itemList", 0, "itemCost"],
          });
        }
        if (!(firstQty >= 1)) {
          ctx.addIssue({
            code: "custom",
            message: "Количеството трябва да е >= 1.",
            path: ["itemList", 0, "itemQuantity"],
          });
        }
      }
    }
  });
