import { collection, getDocs, query, where } from "@firebase/firestore";
import db, { auth } from "../../../firebase";

export async function fetchCurrentUserBusinessDocs() {
  const q = query(collection(db, "businesses"), where("user_id", "==", auth.currentUser.uid));
  return getDocs(q);
}

export function getBusinessMetaFromDoc(businessDoc) {
  const data = businessDoc?.data?.() || businessDoc?.data || {};
  const businessVatRate = Number(data.vatRate);
  const normalizedVatRate = Number.isFinite(businessVatRate) ? businessVatRate : 20;
  return {
    isVatRegistered: data?.isVatRegistered !== false,
    currency: ((data.currency ?? "").toString() || "EUR").toUpperCase(),
    invoices: Number(data.invoices) || 0,
    normalizedVatRate,
    data,
  };
}
