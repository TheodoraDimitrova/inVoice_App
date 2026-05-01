import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ForgotPasswordDialog from "./components/ForgotPasswordDialog";

const AUTH_ILLUSTRATION = "/invoice_auth.jpeg";

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
  <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "#ffffff" }}>
    <Grid container sx={{ minHeight: "100vh", m: 0 }}>
      <Grid
        item
        md={5}
        sx={{
          display: { xs: "none", md: "block" },
          position: "relative",
          minHeight: "100vh",
          backgroundColor: "#e6faf1",
          borderRight: "1px solid var(--color-border-soft)",
          p: 0,
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          src={AUTH_ILLUSTRATION}
          alt="Invoicer — фактуриране и бизнес процеси"
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center center",
          }}
        />
      </Grid>

      <Grid
        item
        xs={12}
        md={7}
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: { xs: 6, md: 8 },
          px: 0,
        }}
      >
        <Box className="page-shell w-full flex justify-center" sx={{ maxWidth: "100%" }}>
          <Box
            sx={{
              width: "100%",
              maxWidth: "28rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Link to="/" className="no-underline mb-6 md:mb-8 block w-full">
              <Typography
                component="span"
                sx={{
                  fontSize: { xs: "1.35rem", sm: "1.5rem" },
                  fontWeight: 600,
                  color: "var(--color-brand-charcoal)",
                  letterSpacing: "-0.02em",
                }}
              >
                Invoicer
              </Typography>
            </Link>

            <Box
              sx={{
                display: { xs: "block", md: "none" },
                width: "100%",
                mb: 5,
                bgcolor: "#e6faf1",
                borderRadius: 2,
                overflow: "hidden",
                position: "relative",
                aspectRatio: "16 / 10",
              }}
            >
              <Box
                component="img"
                src={AUTH_ILLUSTRATION}
                alt=""
                loading="lazy"
                decoding="async"
                sx={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center 42%",
                  display: "block",
                }}
              />
            </Box>

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
          </Box>
        </Box>
      </Grid>
    </Grid>

    <ForgotPasswordDialog
      open={forgotPassword.open}
      onClose={forgotPassword.closeDialog}
      email={forgotPassword.email}
      onEmailChange={forgotPassword.setEmail}
      onSubmit={forgotPassword.submit}
      loading={forgotPassword.loading}
    />
  </Box>
);

export default AuthView;
