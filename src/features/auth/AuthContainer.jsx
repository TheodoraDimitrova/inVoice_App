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
  const { login, register: registerUser, loginWithGoogle } = useAuth();
  const forgotPassword = useForgotPassword();

  const switchMode = (toRegister) => {
    setIsRegister(toRegister);
    reset();
  };

  return (
    <AuthView
      isRegister={isRegister}
      register={register}
      handleSubmit={handleSubmit}
      errors={errors}
      onLogin={login}
      onRegister={registerUser}
      onGoogleLogin={loginWithGoogle}
      onSwitchToRegister={() => switchMode(true)}
      onSwitchToLogin={() => switchMode(false)}
      forgotPassword={forgotPassword}
    />
  );
};

export default AuthContainer;
