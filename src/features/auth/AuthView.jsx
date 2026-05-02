import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ForgotPasswordDialog from "./components/ForgotPasswordDialog";

import authIllustration from "../../images/invoice_auth.jpeg";

const AuthView = ({
  isRegister,
  register,
  handleSubmit,
  errors,
  onLogin,
  onRegister,
  onGoogleLogin,
  onSwitchToRegister,
  onSwitchToLogin,
  forgotPassword,
}) => (
  <div className="min-h-screen w-full bg-white">
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-12">
      <div className="relative hidden min-h-screen overflow-hidden border-r border-[var(--color-border-soft)] bg-[#e6faf1] md:col-span-5 md:block">
        <img
          src={authIllustration}
          alt="Invoicer — фактуриране и бизнес процеси"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      </div>

      <div className="flex min-h-screen items-center justify-center py-12 md:col-span-7 md:py-16">
        <div className="page-shell flex w-full max-w-full justify-center">
          <div className="flex w-full max-w-md flex-col items-center text-center">
            <Link to="/" className="no-underline mb-6 md:mb-8 block w-full">
              <span className="text-[1.35rem] font-semibold tracking-[-0.02em] text-[var(--color-brand-charcoal)] sm:text-2xl">
                Invoicer
              </span>
            </Link>

            <div className="relative mb-10 block aspect-[16/10] w-full overflow-hidden rounded-2xl bg-[#e6faf1] md:hidden">
              <img
                src={authIllustration}
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute inset-0 block h-full w-full object-cover object-[center_42%]"
              />
            </div>

            {isRegister ? (
              <RegisterForm
                register={register}
                handleSubmit={handleSubmit}
                errors={errors}
                onSubmit={onRegister}
                onGoogleLogin={onGoogleLogin}
                onSwitchToLogin={onSwitchToLogin}
              />
            ) : (
              <LoginForm
                register={register}
                handleSubmit={handleSubmit}
                errors={errors}
                onSubmit={onLogin}
                onGoogleLogin={onGoogleLogin}
                onForgotPassword={forgotPassword.openDialog}
                onSwitchToRegister={onSwitchToRegister}
              />
            )}
          </div>
        </div>
      </div>
    </div>

    <ForgotPasswordDialog
      open={forgotPassword.open}
      onClose={forgotPassword.closeDialog}
      email={forgotPassword.email}
      onEmailChange={forgotPassword.setEmail}
      onSubmit={forgotPassword.submit}
      loading={forgotPassword.loading}
    />
  </div>
);

export default AuthView;
