import React, { createContext, useContext, useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "@firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import db from "../firebase";
import { isInvoiceCreationReady } from "../utils/invoiceCreationReady";

const InvoiceCreationReadyContext = createContext({
  loading: true,
  ready: false,
});

export function InvoiceCreationReadyProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let unsubBusiness;
    const unsubAuth = onAuthStateChanged(getAuth(), (user) => {
      unsubBusiness?.();
      unsubBusiness = undefined;

      if (!user) {
        setReady(false);
        setLoading(false);
        return;
      }

      setLoading(true);
      const q = query(collection(db, "businesses"), where("user_id", "==", user.uid));
      unsubBusiness = onSnapshot(
        q,
        (snap) => {
          if (snap.empty) {
            setReady(false);
          } else {
            const data = snap.docs[0].data();
            setReady(isInvoiceCreationReady(data));
          }
          setLoading(false);
        },
        () => {
          setReady(false);
          setLoading(false);
        }
      );
    });

    return () => {
      unsubAuth();
      unsubBusiness?.();
    };
  }, []);

  return (
    <InvoiceCreationReadyContext.Provider value={{ loading, ready }}>
      {children}
    </InvoiceCreationReadyContext.Provider>
  );
}

export function useInvoiceCreationReady() {
  return useContext(InvoiceCreationReadyContext);
}
