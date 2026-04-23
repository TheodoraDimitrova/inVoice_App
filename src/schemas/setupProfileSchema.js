import { z } from "zod";
import { isValidIBAN } from "ibantools";
import { COUNTRIES } from "../data/countries";
import { validatePrimaryCompanyIdentity } from "../data/companyIdentityRules";
import { validateVatNumberFormat } from "../utils/vatNumberValidation";

const PHONE_REGEX = /^[+]?[0-9][0-9\s-]{5,20}$/;
const isSupportedCountry = (value) => COUNTRIES.includes(value);

export const setupProfileSchema = z
  .object({
    businessName: z.string().trim().min(1, "Името на фирмата е задължително"),

    email: z
      .string()
      .trim()
      .min(1, "Имейлът е задължителен")
      .pipe(z.email("Моля, въведете валиден имейл адрес.")),

    phone: z
      .string()
      .trim()
      .min(1, "Телефонът е задължителен")
      .regex(
        PHONE_REGEX,
        "Невалиден формат на телефон. Използвайте цифри с опционални +, интервали или -.",
      ),
    businessAddress: z.string().trim().min(1, "Адресът е задължителен"),
    postCode: z.string().trim().min(1, "Пощенският код е задължителен"),
    city: z.string().trim().min(1, "Градът е задължителен"),
    country: z
      .string()
      .trim()
      .min(1, "Държавата е задължителна")
      .refine(isSupportedCountry, "Неподдържана държава."),

    /** VAT-registered business (VAT ID required and format-checked). */
    isVatRegistered: z.boolean(),

    vat: z.string(),
    tic: z.string(),

    vatRate: z.preprocess((val) => {
      if (val === "" || val === undefined || val === null) return 20;
      const n = typeof val === "number" ? val : Number(val);
      return Number.isNaN(n) ? 20 : n;
    }, z.number().min(0).max(100)),

    bankName: z.string(),
    iban: z.string().transform((s) => s.replace(/\s+/g, "").toUpperCase()),
    swift: z.string().transform((s) => s.toUpperCase()),
    noBankDetailsOnInvoices: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (!data.isVatRegistered) {
      return;
    }
    if (!data.country?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Изберете държава на фирмата, преди да въведете ДДС номер.",
        path: ["country"],
      });
      return;
    }
    const r = validateVatNumberFormat(data.vat, data.country);
    if (!r.ok) {
      ctx.addIssue({
        code: "custom",
        message: r.message ?? "Невалиден ДДС номер.",
        path: ["vat"],
      });
    }
  })
  .superRefine((data, ctx) => {
    const r = validatePrimaryCompanyIdentity(data.tic, data.country);
    if (!r.ok) {
      ctx.addIssue({
        code: "custom",
        message: r.message ?? "Невалиден фирмен идентификатор.",
        path: ["tic"],
      });
    }
  })
  .superRefine((data, ctx) => {
    if (data.noBankDetailsOnInvoices) {
      return;
    }
    const bankName = (data.bankName ?? "").trim();
    const iban = (data.iban ?? "").trim();
    const swift = (data.swift ?? "").trim();
    const anyBankFieldFilled = Boolean(bankName || iban || swift);
    if (!anyBankFieldFilled) {
      return;
    }

    if (!bankName) {
      ctx.addIssue({
        code: "custom",
        message: "Името на банка е задължително, когато има банкови данни.",
        path: ["bankName"],
      });
    }
    if (!iban) {
      ctx.addIssue({
        code: "custom",
        message: "IBAN е задължителен, когато има банкови данни.",
        path: ["iban"],
      });
    } else if (!isValidIBAN(iban)) {
      ctx.addIssue({
        code: "custom",
        message: "Невалиден формат или контролна сума на IBAN.",
        path: ["iban"],
      });
    }
    if (!swift) {
      ctx.addIssue({
        code: "custom",
        message: "SWIFT / BIC е задължителен, когато има банкови данни.",
        path: ["swift"],
      });
    }
  });
