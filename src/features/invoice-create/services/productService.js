import { collection, getDocs } from "@firebase/firestore";
import db, { auth } from "../../../firebase";
import { normalizeStoredProduct } from "../../../data/productCatalogRules";

export async function fetchUserProducts() {
  const userId = auth.currentUser.uid;
  const querySnapshot = await getDocs(collection(db, "users", userId, "products"));
  return querySnapshot.docs.map((d) => normalizeStoredProduct(d.data(), d.id));
}
