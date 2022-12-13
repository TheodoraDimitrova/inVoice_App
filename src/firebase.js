import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { EmailAuthProvider } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDBTK4v5Kf3xt7A0ELU-aifnFxJLMSahqQ",
  authDomain: "invoice-8aadd.firebaseapp.com",
  projectId: "invoice-8aadd",
  storageBucket: "invoice-8aadd.appspot.com",
  messagingSenderId: "585515884504",
  appId: "1:585515884504:web:03001682cc708fb2605cad",
};

const app = initializeApp(firebaseConfig);
const provider = new EmailAuthProvider();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
export { provider, auth, storage };
export default db;
