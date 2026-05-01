import { collection, onSnapshot, query, where } from "@firebase/firestore";
import db from "../../../firebase";

export function subscribeBusinessByUser(uid, onNext, onError) {
  const businessQuery = query(collection(db, "businesses"), where("user_id", "==", uid));

  return onSnapshot(
    businessQuery,
    (snapshot) => {
      const business = snapshot.empty ? null : snapshot.docs[0].data();
      onNext(business);
    },
    onError
  );
}
