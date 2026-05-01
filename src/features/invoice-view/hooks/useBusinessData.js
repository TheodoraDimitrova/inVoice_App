import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "@firebase/firestore";
import { getAuth } from "firebase/auth";
import db from "../../../firebase";

export const useBusinessData = () => {
  const auth = getAuth();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      setLoading(false);
      return undefined;
    }

    const q = query(collection(db, "businesses"), where("user_id", "==", uid));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          setBusiness(null);
        } else {
          setBusiness(snapshot.docs[0].data());
        }
        setLoading(false);
      },
      (error) => {
        console.error(error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [auth.currentUser?.uid]);

  return { business, loading };
};
