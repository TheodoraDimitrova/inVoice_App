import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import db, { auth } from "../../../firebase";
import { normalizeStoredProduct } from "../../../data/productCatalogRules";

export async function fetchProductsForCurrentUser() {
  const userId = auth.currentUser.uid;
  const querySnapshot = await getDocs(collection(db, "users", userId, "products"));
  return querySnapshot.docs.map((d) => normalizeStoredProduct(d.data(), d.id));
}

export async function createProductForCurrentUser(payload) {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("Потребителят не е автентикиран.");
  await addDoc(collection(db, "users", userId, "products"), payload);
}

export async function updateProductForCurrentUser(productId, payload) {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("Потребителят не е автентикиран.");
  await updateDoc(doc(db, "users", userId, "products", productId), payload);
}

export async function deleteProductForCurrentUser(productId) {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("Потребителят не е автентикиран.");
  await deleteDoc(doc(db, "users", userId, "products", productId));
}
