import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "@firebase/firestore";
import { getAuth } from "firebase/auth";
import db from "../../../firebase";

export const useInvoicesData = () => {
  const auth = getAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vatRate, setVatRate] = useState(20);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return undefined;

    const invoicesQuery = query(
      collection(db, "invoices"),
      where("user_id", "==", uid),
      orderBy("timestamp", "desc"),
    );

    const unsubscribe = onSnapshot(
      invoicesQuery,
      (snapshot) => {
        const rows = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          data: docSnap.data(),
        }));
        setInvoices(rows);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [auth.currentUser?.uid]);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return undefined;

    const businessQuery = query(
      collection(db, "businesses"),
      where("user_id", "==", uid),
    );
    const unsubscribe = onSnapshot(businessQuery, (snapshot) => {
      if (snapshot.empty) {
        setVatRate(20);
        return;
      }

      const business = snapshot.docs[0].data();
      const parsedVat = Number(business.vatRate);
      setVatRate(Number.isFinite(parsedVat) ? parsedVat : 20);
    });

    return () => unsubscribe();
  }, [auth.currentUser?.uid]);

  return {
    invoices,
    loading,
    vatRate,
  };
};
