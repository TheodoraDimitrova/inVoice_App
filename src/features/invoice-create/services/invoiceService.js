import { addDoc, collection, doc, getDoc, updateDoc } from "@firebase/firestore";
import db from "../../../firebase";

export async function fetchInvoiceById(invoiceId) {
  const invoiceRef = doc(db, "invoices", invoiceId);
  return getDoc(invoiceRef);
}

export async function createInvoice(payload) {
  return addDoc(collection(db, "invoices"), payload);
}

export async function updateInvoice(invoiceId, payload) {
  const invoiceRef = doc(db, "invoices", invoiceId);
  return updateDoc(invoiceRef, payload);
}
