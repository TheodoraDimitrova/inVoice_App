import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import db, { auth } from "../../../firebase";
import { normalizeStoredCustomer } from "../utils/customerNormalizers";

const customersCollection = (userId) => collection(db, "users", userId, "customers");

export async function fetchCustomersForCurrentUser() {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("Потребителят не е автентикиран.");
  const querySnapshot = await getDocs(customersCollection(userId));
  return querySnapshot.docs.map((d) => normalizeStoredCustomer(d.data(), d.id));
}

export async function createCustomerForCurrentUser(payload) {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("Потребителят не е автентикиран.");
  await addDoc(customersCollection(userId), payload);
}

export async function updateCustomerForCurrentUser(customerId, payload) {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("Потребителят не е автентикиран.");
  await updateDoc(doc(db, "users", userId, "customers", customerId), payload);
}

export async function deleteCustomerForCurrentUser(customerId) {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("Потребителят не е автентикиран.");
  await deleteDoc(doc(db, "users", userId, "customers", customerId));
}
