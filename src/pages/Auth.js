import {
  Box,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { sendPasswordResetEmail } from "firebase/auth";

import { showToast } from "../utils/functions";
import { outlinedFieldLabelProps, outlinedFieldSx } from "../utils/muiFieldSx";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const AUTH_ILLUSTRATION = "/invoice_auth.jpeg";

const Auth = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [createAccount, setCreateAccount] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [forgotDialogOpen, setForgotDialogOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const emailFormat =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  const signUpUser = (data) => {
    createUserWithEmailAndPassword(
      auth,
      data.registerEmail,
      data.registerPassword,
    )
      .then(() => {
        showToast("success", "Регистрацията е успешна!🚀");
        navigate("/profile");
      })
      .catch((error) => {
        console.log(error.code);
        if (error.code === "auth/email-already-in-use") {
          showToast("error", "Имейлът вече се използва");
        }
      });
  };

  const loginUser = (data) => {
    signInWithEmailAndPassword(auth, data.loginEmail, data.loginPassword)
      .then((userCredential) => {
        if (userCredential) {
          showToast("success", "Входът е успешен!🚀");
          navigate("/profile");
        }
      })
      .catch((error) => {
        if (error.code === "auth/wrong-password") {
          showToast("error", "Грешна парола!");
        }
        if (error.code === "auth/user-not-found") {
          showToast("error", "Няма потребител с този имейл!");
        }
      });
  };

  const switchView = (value) => {
    setCreateAccount(!value);
    setShowRegisterPassword(false);
    setShowLoginPassword(false);
    reset();
  };

  const openForgotPasswordDialog = () => {
    setResetEmail("");
    setForgotDialogOpen(true);
  };

  const closeForgotPasswordDialog = () => {
    if (resetLoading) return;
    setForgotDialogOpen(false);
  };

  const handleForgotPassword = async () => {
    const email = String(resetEmail || "").trim();
    if (!email) {
      showToast("error", "Моля, въведете имейл адрес.");
      return;
    }
    if (!emailFormat.test(email)) {
      showToast("error", "Въведете валиден имейл адрес.");
      return;
    }
    try {
      setResetLoading(true);
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        // Local CRA dev server (or missing deployment endpoint) fallback.
        if (response.status === 404 || response.status === 405) {
          await sendPasswordResetEmail(auth, email);
        } else {
          throw new Error("request_failed");
        }
      }
      showToast(
        "success",
        "Ако имейлът съществува, изпратихме линк за възстановяване на парола.",
      );
      setForgotDialogOpen(false);
    } catch {
      showToast("error", "Неуспешно изпращане. Опитайте отново.");
    } finally {
      setResetLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      if (userCredential?.user) {
        showToast("success", "Успешен вход с Google!🚀");
        navigate("/profile");
      }
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user") {
        return;
      }
      if (error.code === "auth/account-exists-with-different-credential") {
        showToast("error", "Този имейл вече е регистриран с друг метод за вход.");
        return;
      }
      showToast("error", "Неуспешен вход с Google. Опитайте отново.");
    }
  };

  const switchLinkClass =
    "mt-5 w-full text-center text-sm font-medium bg-transparent border-0 cursor-pointer p-0 text-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary-hover)] hover:underline underline-offset-2 transition-colors";

  return (
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
          <Box
            className="page-shell w-full flex justify-center"
            sx={{ maxWidth: "100%" }}
          >
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

              {createAccount ? (
                <Box
                  component="form"
                  noValidate
                  autoComplete="off"
                  onSubmit={handleSubmit(signUpUser)}
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch",
                  }}
                >
                  {errors?.registerEmail && (
                    <Typography
                      sx={{
                        color: "error.main",
                        mb: 1,
                        fontSize: "0.875rem",
                        width: "100%",
                        textAlign: "center",
                      }}
                    >
                      {errors.registerEmail.message}
                    </Typography>
                  )}
                  <TextField
                    label="Имейл"
                    variant="outlined"
                    fullWidth
                    size="medium"
                    InputLabelProps={outlinedFieldLabelProps}
                    sx={outlinedFieldSx}
                    {...register("registerEmail", {
                      required: "Моля, въведете валиден имейл",
                      pattern: {
                        value: emailFormat,
                        message: "Въведете валиден имейл",
                      },
                    })}
                    type="email"
                  />

                  {errors?.registerPassword && (
                    <Typography
                      sx={{
                        color: "error.main",
                        mb: 1,
                        fontSize: "0.875rem",
                        width: "100%",
                        textAlign: "center",
                      }}
                    >
                      {errors.registerPassword.message}
                    </Typography>
                  )}
                  <TextField
                    label="Парола"
                    autoComplete="new-password"
                    type={showRegisterPassword ? "text" : "password"}
                    variant="outlined"
                    fullWidth
                    size="medium"
                    InputLabelProps={outlinedFieldLabelProps}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={
                              showRegisterPassword
                                ? "Скрий парола"
                                : "Покажи парола"
                            }
                            onClick={() =>
                              setShowRegisterPassword((prev) => !prev)
                            }
                            edge="end"
                          >
                            {showRegisterPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={outlinedFieldSx}
                    {...register("registerPassword", {
                      required: "Моля, въведете парола",
                      minLength: {
                        value: 8,
                        message: "Паролата трябва да е поне 8 символа",
                      },
                    })}
                  />

                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                    size="large"
                    sx={{ mt: 1, mb: 0, py: 1.25 }}
                  >
                    Регистрация
                  </Button>
                  <Divider sx={{ my: 2 }}>или</Divider>
                  <Button
                    variant="outlined"
                    fullWidth
                    size="large"
                    onClick={signInWithGoogle}
                    sx={{ py: 1.25 }}
                  >
                    Продължи с Google
                  </Button>

                  <button
                    type="button"
                    className={switchLinkClass}
                    onClick={() => switchView(true)}
                  >
                    Вече имате акаунт? Влезте
                  </button>
                </Box>
              ) : (
                <Box
                  component="form"
                  noValidate
                  autoComplete="off"
                  onSubmit={handleSubmit(loginUser)}
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch",
                  }}
                >
                  {errors?.loginEmail && (
                    <Typography
                      sx={{
                        color: "error.main",
                        mb: 1,
                        fontSize: "0.875rem",
                        width: "100%",
                        textAlign: "center",
                      }}
                    >
                      {errors.loginEmail.message}
                    </Typography>
                  )}
                  <TextField
                    label="Имейл"
                    variant="outlined"
                    fullWidth
                    size="medium"
                    InputLabelProps={outlinedFieldLabelProps}
                    sx={outlinedFieldSx}
                    {...register("loginEmail", {
                      required: "Моля, въведете валиден имейл",
                      pattern: {
                        value: emailFormat,
                        message: "Въведете валиден имейл",
                      },
                    })}
                    type="email"
                  />

                  {errors?.loginPassword && (
                    <Typography
                      sx={{
                        color: "error.main",
                        mb: 1,
                        fontSize: "0.875rem",
                        width: "100%",
                        textAlign: "center",
                      }}
                    >
                      {errors.loginPassword.message}
                    </Typography>
                  )}
                  <TextField
                    label="Парола"
                    type={showLoginPassword ? "text" : "password"}
                    autoComplete="current-password"
                    variant="outlined"
                    fullWidth
                    size="medium"
                    InputLabelProps={outlinedFieldLabelProps}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={
                              showLoginPassword ? "Скрий парола" : "Покажи парола"
                            }
                            onClick={() => setShowLoginPassword((prev) => !prev)}
                            edge="end"
                          >
                            {showLoginPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={outlinedFieldSx}
                    {...register("loginPassword", {
                      required: "Моля, въведете парола",
                      minLength: {
                        value: 8,
                        message: "Паролата трябва да е поне 8 символа",
                      },
                    })}
                  />

                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                    size="large"
                    sx={{ mt: 1, mb: 0, py: 1.25 }}
                  >
                    Вход
                  </Button>
                  <Button
                    variant="text"
                    onClick={openForgotPasswordDialog}
                    sx={{ mt: 1, alignSelf: "center", textTransform: "none" }}
                  >
                    Забравена парола?
                  </Button>
                  <Divider sx={{ my: 2 }}>или</Divider>
                  <Button
                    variant="outlined"
                    fullWidth
                    size="large"
                    onClick={signInWithGoogle}
                    sx={{ py: 1.25 }}
                  >
                    Продължи с Google
                  </Button>

                  <button
                    type="button"
                    className={switchLinkClass}
                    onClick={() => switchView(false)}
                  >
                    Създай акаунт
                  </button>
                </Box>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Dialog
        open={forgotDialogOpen}
        onClose={closeForgotPasswordDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Възстановяване на парола</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Въведете имейла си и ще получите линк за смяна на паролата.
          </Typography>
          <TextField
            autoFocus
            label="Имейл"
            type="email"
            fullWidth
            size="medium"
            InputLabelProps={outlinedFieldLabelProps}
            sx={{ ...outlinedFieldSx, mb: 0 }}
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={closeForgotPasswordDialog} disabled={resetLoading}>
            Отказ
          </Button>
          <Button
            variant="contained"
            onClick={handleForgotPassword}
            disabled={resetLoading}
          >
            Изпрати линк
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Auth;
