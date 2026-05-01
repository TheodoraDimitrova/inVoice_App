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
  const userId = auth.currentUser.uid;
  await addDoc(collection(db, "users", userId, "products"), payload);
}

export async function updateProductForCurrentUser(productId, payload) {
  const userId = auth.currentUser.uid;
  await updateDoc(doc(db, "users", userId, "products", productId), payload);
}

export async function deleteProductForCurrentUser(productId) {
  const userId = auth.currentUser.uid;
  await deleteDoc(doc(db, "users", userId, "products", productId));
}
