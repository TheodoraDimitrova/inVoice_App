import { collection, onSnapshot, orderBy, query, where } from "@firebase/firestore";
import db from "../../../firebase";

export function subscribeInvoicesByUser(uid, onNext, onError) {
  const invoicesQuery = query(
    collection(db, "invoices"),
    where("user_id", "==", uid),
    orderBy("timestamp", "desc")
  );

  return onSnapshot(
    invoicesQuery,
    (snapshot) => {
      const invoices = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        data: docSnap.data(),
      }));
      onNext(invoices);
    },
    onError
  );
}
