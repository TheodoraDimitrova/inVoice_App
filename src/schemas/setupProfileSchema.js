import { z } from "zod";

export const setupProfileSchema = z.object({
  businessName: z.string().trim().min(1, "Company name is required"),

  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .pipe(z.email("Please enter a valid email address.")),

  phone: z.string().trim().min(1, "Phone is required"),
  businessAddress: z.string().trim().min(1, "Street address is required"),
  postCode: z.string().trim().min(1, "Post code is required"),
  city: z.string().trim().min(1, "City is required"),
  country: z.string().trim().min(1, "Country is required"),

  vat: z.string(),
  tic: z.string(),

  vatRate: z.preprocess((val) => {
    if (val === "" || val === undefined || val === null) return 20;
    const n = typeof val === "number" ? val : Number(val);
    return Number.isNaN(n) ? 20 : n;
  }, z.number().min(0).max(100)),

  bankName: z.string(),
  iban: z.string().transform((s) => s.toUpperCase()),
  swift: z.string().transform((s) => s.toUpperCase()),
});
