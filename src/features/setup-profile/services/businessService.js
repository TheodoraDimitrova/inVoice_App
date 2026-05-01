import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "@firebase/firestore";
import db from "../../../firebase";

export const subscribeBusinessByUserId = ({ userId, onData, onError }) => {
  const q = query(collection(db, "businesses"), where("user_id", "==", userId));
  return onSnapshot(
    q,
    (querySnapshot) => {
      const rows = [];
      querySnapshot.forEach((d) => rows.push({ id: d.id, ...d.data() }));
      onData(rows);
    },
    onError,
  );
};

export const mapBusinessToFormValues = (business) => {
  const vatRate = Number(business.vatRate);
  return {
    businessName: business.businessName ?? "",
    email: business.email ?? "",
    phone: business.phone ?? "",
    businessAddress: business.businessAddress ?? "",
    postCode: business.postCode ?? "",
    city: business.city ?? "",
    country: "Bulgaria",
    isVatRegistered:
      typeof business.isVatRegistered === "boolean"
        ? business.isVatRegistered
        : Boolean((business.vat ?? "").toString().trim()),
    vat: business.vat ?? "",
    tic: business.tic ?? "",
    currency: business.currency ?? "EUR",
    vatRate: Number.isNaN(vatRate) ? 20 : vatRate,
    bankName: business.bankName ?? "",
    iban: (business.iban ?? "").toString(),
    swift: (business.swift ?? "").toString(),
    noBankDetailsOnInvoices: business.noBankDetailsOnInvoices === true,
  };
};

export const mapFormToBusinessPayload = ({ data, logo }) => ({
  vatRate: Number(data.vatRate) || 0,
  businessName: data.businessName,
  businessAddress: data.businessAddress,
  postCode: data.postCode,
  city: data.city,
  country: data.country,
  businessCity: (() => {
    const pc = (data.postCode ?? "").trim();
    const city = (data.city ?? "").trim();
    const line = [pc, city].filter(Boolean).join(" ");
    return line ? `${line}, ${data.country}` : data.country;
  })(),
  phone: data.phone,
  tic: data.tic,
  isVatRegistered: data.isVatRegistered,
  vat: data.isVatRegistered ? data.vat : "",
  currency: (data.currency ?? "EUR").trim().toUpperCase(),
  email: data.email,
  iban: data.iban,
  swift: data.swift,
  bankName: data.bankName,
  noBankDetailsOnInvoices: data.noBankDetailsOnInvoices === true,
  logo,
});

export const createBusiness = ({ userId, payload }) =>
  addDoc(collection(db, "businesses"), {
    user_id: userId,
    ...payload,
    invoices: 0,
  });

export const updateBusiness = ({ businessId, payload }) =>
  updateDoc(doc(db, "businesses", businessId), payload);

