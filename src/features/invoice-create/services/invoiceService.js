import { addDoc, collection, deleteDoc, doc, getDoc, serverTimestamp, updateDoc } from "@firebase/firestore";
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

export async function deleteInvoiceById(invoiceId) {
  const invoiceRef = doc(db, "invoices", invoiceId);
  return deleteDoc(invoiceRef);
}

export async function markInvoicePaid(invoiceId) {
  return updateInvoice(invoiceId, {
    status: "paid",
    paid: true,
    paymentStatus: "paid",
    paidAt: serverTimestamp(),
  });
}
