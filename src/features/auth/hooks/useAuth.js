import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { collection, getDocs, query, where } from "@firebase/firestore";
import db, { auth, googleProvider } from "../../../firebase";
import { showToast } from "../../../utils/functions";
import { isInvoiceCreationReady } from "../../../utils/invoiceCreationReady";
import { getAuthErrorMessage } from "../utils/authErrors";

const resolvePostLoginPath = async (uid) => {
  try {
    const q = query(collection(db, "businesses"), where("user_id", "==", uid));
    const snapshot = await getDocs(q);
    const business = snapshot.docs[0]?.data() || null;
    return isInvoiceCreationReady(business) ? "/dashboard" : "/profile";
  } catch {
    return "/profile";
  }
};

export const useAuth = () => {
  const navigate = useNavigate();

  const login = async (data) => {
    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        data.loginEmail,
        data.loginPassword,
      );
      showToast("success", "Входът е успешен!🚀");
      const nextPath = await resolvePostLoginPath(credential.user.uid);
      navigate(nextPath);
    } catch (error) {
      const message = getAuthErrorMessage(error.code) ?? "Грешка при вход. Опитайте отново.";
      showToast("error", message);
    }
  };

  const register = async (data) => {
    try {
      await createUserWithEmailAndPassword(auth, data.registerEmail, data.registerPassword);
      showToast("success", "Регистрацията е успешна!🚀");
      navigate("/profile");
    } catch (error) {
      const message = getAuthErrorMessage(error.code) ?? "Грешка при регистрация. Опитайте отново.";
      showToast("error", message);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const credential = await signInWithPopup(auth, googleProvider);
      if (!credential?.user) return;
      showToast("success", "Успешен вход с Google!🚀");
      const nextPath = await resolvePostLoginPath(credential.user.uid);
      navigate(nextPath);
    } catch (error) {
      const message = getAuthErrorMessage(error.code);
      if (message === null) return;
      const fallback = `Неуспешен вход с Google (${error.code || "неизвестна грешка"}). Опитайте отново.`;
      showToast("error", message ?? fallback);
    }
  };

  return { login, register, loginWithGoogle };
};
