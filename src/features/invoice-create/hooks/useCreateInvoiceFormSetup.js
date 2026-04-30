import { useMemo } from "react";
import { createInvoiceSchema } from "../../../schemas/createInvoiceSchema";
import { useCreateInvoiceForm } from "./useCreateInvoiceForm";

const watchedFields = [
  "customerName",
  "customerType",
  "customerAddress",
  "customerPostCode",
  "customerCity",
  "customerCountry",
  "customerEmail",
  "companyIdentifier",
  "customerVatRegistered",
  "customerVatNumber",
  "currency",
  "issueDate",
  "dueDate",
  "includeInvoiceNote",
  "invoiceNote",
];

export const useCreateInvoiceFormSetup = ({ defaultValues }) => {
  const form = useCreateInvoiceForm({
    schema: createInvoiceSchema,
    defaultValues,
    mode: "onSubmit",
    watchedFields,
  });

  const formValues = useMemo(
    () => ({
      customerName: form.values.customerName,
      customerType: form.values.customerType,
      customerAddress: form.values.customerAddress,
      customerPostCode: form.values.customerPostCode,
      customerCity: form.values.customerCity,
      customerCountry: form.values.customerCountry,
      customerEmail: form.values.customerEmail,
      companyIdentifier: form.values.companyIdentifier,
      customerVatRegistered: form.values.customerVatRegistered,
      customerVatNumber: form.values.customerVatNumber,
      currency: form.values.currency,
      issueDate: form.values.issueDate,
      dueDate: form.values.dueDate,
      includeInvoiceNote: form.values.includeInvoiceNote,
      invoiceNote: form.values.invoiceNote,
    }),
    [form.values],
  );

  return { form, formValues };
};
