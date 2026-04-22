import { z } from "zod";
import { isValidIBAN } from "ibantools";
import { COUNTRIES } from "../data/countries";
import { validatePrimaryCompanyIdentity } from "../data/companyIdentityRules";
import { validateVatNumberFormat } from "../utils/vatNumberValidation";

const PHONE_REGEX = /^[+]?[0-9][0-9\s-]{5,20}$/;
const isSupportedCountry = (value) => COUNTRIES.includes(value);

export const setupProfileSchema = z
  .object({
    businessName: z.string().trim().min(1, "Company name is required"),

    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .pipe(z.email("Please enter a valid email address.")),

    phone: z
      .string()
      .trim()
      .min(1, "Phone is required")
      .regex(
        PHONE_REGEX,
        "Invalid phone format. Use digits with optional +, spaces, or -.",
      ),
    businessAddress: z.string().trim().min(1, "Street address is required"),
    postCode: z.string().trim().min(1, "Post code is required"),
    city: z.string().trim().min(1, "City is required"),
    country: z
      .string()
      .trim()
      .min(1, "Country is required")
      .refine(isSupportedCountry, "Unsupported country."),

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
        message: "Select your business country before entering a VAT number.",
        path: ["country"],
      });
      return;
    }
    const r = validateVatNumberFormat(data.vat, data.country);
    if (!r.ok) {
      ctx.addIssue({
        code: "custom",
        message: r.message ?? "Invalid VAT number.",
        path: ["vat"],
      });
    }
  })
  .superRefine((data, ctx) => {
    const r = validatePrimaryCompanyIdentity(data.tic, data.country);
    if (!r.ok) {
      ctx.addIssue({
        code: "custom",
        message: r.message ?? "Invalid company identifier.",
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
        message: "Bank name is required when bank details are provided.",
        path: ["bankName"],
      });
    }
    if (!iban) {
      ctx.addIssue({
        code: "custom",
        message: "IBAN is required when bank details are provided.",
        path: ["iban"],
      });
    } else if (!isValidIBAN(iban)) {
      ctx.addIssue({
        code: "custom",
        message: "Invalid IBAN format or checksum.",
        path: ["iban"],
      });
    }
    if (!swift) {
      ctx.addIssue({
        code: "custom",
        message: "SWIFT / BIC is required when bank details are provided.",
        path: ["swift"],
      });
    }
  });
