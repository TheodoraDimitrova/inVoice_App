import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../firebase";
import { showToast } from "../../../utils/functions";
import { EMAIL_REGEX } from "../utils/authErrors";

export const useForgotPassword = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const openDialog = () => {
    setEmail("");
    setOpen(true);
  };

  const closeDialog = () => {
    if (loading) return;
    setOpen(false);
  };

  const submit = async () => {
    const trimmed = String(email || "").trim();
    if (!trimmed) {
      showToast("error", "Моля, въведете имейл адрес.");
      return;
    }
    if (!EMAIL_REGEX.test(trimmed)) {
      showToast("error", "Въведете валиден имейл адрес.");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      if (!response.ok) {
        if (response.status === 404 || response.status === 405) {
          await sendPasswordResetEmail(auth, trimmed);
        } else {
          throw new Error("request_failed");
        }
      }
      showToast("success", "Ако имейлът съществува, изпратихме линк за възстановяване на парола.");
      setOpen(false);
    } catch {
      showToast("error", "Неуспешно изпращане. Опитайте отново.");
    } finally {
      setLoading(false);
    }
  };

  return { open, email, setEmail, loading, openDialog, closeDialog, submit };
};
