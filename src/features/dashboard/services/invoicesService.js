import { subscribeInvoicesByUser } from "../repositories/invoicesRepository";

export function subscribeInvoices(uid, onNext, onError) {
  return subscribeInvoicesByUser(uid, onNext, onError);
}
