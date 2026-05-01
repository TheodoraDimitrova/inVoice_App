import { useEffect, useState } from "react";
import { doc, onSnapshot } from "@firebase/firestore";
import db from "../../../firebase";

export const useInvoiceData = (id, previewData = null) => {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (previewData) {
      setInvoice(previewData);
      setLoading(false);
      return undefined;
    }

    if (!id) {
      setInvoice(null);
      setLoading(false);
      return undefined;
    }

    const unsubscribe = onSnapshot(
      doc(db, "invoices", id),
      (snapshot) => {
        setInvoice(snapshot.data() || null);
        setLoading(false);
      },
      (error) => {
        console.error(error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [id, previewData]);

  return { invoice, loading };
};
