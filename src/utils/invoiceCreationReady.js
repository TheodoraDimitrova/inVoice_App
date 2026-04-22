import {
  validatePrimaryCompanyIdentity,
} from "../data/companyIdentityRules";

function str(v) {
  if (v == null) return "";
  return String(v).trim();
}

/**
 * Dashboard opens after company + address (setup form essentials).
 * Creating an invoice additionally requires a VAT number when VAT-registered and bank details.
 * Company / trade ID (tic) is required for all supported countries.
 * Logo is optional.
 *
 * @param {Record<string, unknown> | null | undefined} raw Firestore `businesses` document
 */
export function getInvoiceCreationStatus(raw) {
  const hasVat = str(raw?.vat).length > 0;
  const country = str(raw?.country);
  const tic = str(raw?.tic);
  const vatReg = raw?.isVatRegistered;
  const ticValidation = validatePrimaryCompanyIdentity(tic, country);
  const companyIdOk = ticValidation.ok;
  /** @type {boolean} */
  let taxOk;
  if (vatReg === true) {
    taxOk = hasVat && companyIdOk;
  } else if (vatReg === false) {
    taxOk = companyIdOk;
  } else {
    taxOk = companyIdOk;
  }
  const skipBankDetails = raw?.noBankDetailsOnInvoices === true;
  const bankOk = skipBankDetails
    ? true
    : str(raw?.bankName).length > 0 &&
      str(raw?.iban).length > 0 &&
      str(raw?.swift).length > 0;

  return {
    ready: taxOk && bankOk,
    taxOk,
    bankOk,
    skipBankDetails,
  };
}

export function isInvoiceCreationReady(raw) {
  return getInvoiceCreationStatus(raw).ready;
}
