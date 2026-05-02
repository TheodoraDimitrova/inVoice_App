import React, { useState } from "react";
import { useForm } from "react-hook-form";
import AuthView from "./AuthView";
import { useAuth } from "./hooks/useAuth";
import { useForgotPassword } from "./hooks/useForgotPassword";

const AuthContainer = () => {
  const [isRegister, setIsRegister] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const { login, register: signUp, loginWithGoogle } = useAuth();
  const { open, email, loading, openDialog, closeDialog, setEmail, submit } =
    useForgotPassword();

  const goToRegister = () => {
    setIsRegister(true);
    reset();
  };

  const goToLogin = () => {
    setIsRegister(false);
    reset();
  };

  return (
    <AuthView
      isRegister={isRegister}
      register={register}
      handleSubmit={handleSubmit}
      errors={errors}
      onLogin={login}
      onRegister={signUp}
      onGoogleLogin={loginWithGoogle}
      onSwitchToRegister={goToRegister}
      onSwitchToLogin={goToLogin}
      forgotPassword={{
        open,
        email,
        loading,
        onOpen: openDialog,
        onClose: closeDialog,
        onEmailChange: (e) => setEmail(e.target.value),
        onSubmit: submit,
      }}
    />
  );
};

export default AuthContainer;
