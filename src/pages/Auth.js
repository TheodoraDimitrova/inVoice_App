import { Box, Grid, TextField, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import login from "../images/print.png";
import invoiceLogo from "../images/invoiceLogo.png";
import useStyles from "../utils/muiStyles";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";

import { showToast } from "../utils/functions";

const Auth = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [createAccount, setCreateAccount] = useState(false);
  const emailFormat =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  const signUpUser = (data) => {
    createUserWithEmailAndPassword(
      auth,
      data.registerEmail,
      data.registerPassword
    )
      .then((userCredential) => {
        showToast("success", "Congratulations!🚀");
        navigate("/profile");
      })

      .catch((error) => {
        console.log(error.code);
        if (error.code === "auth/email-already-in-use") {
          showToast("error", "Email already in use");
        }
      });
  };

  const loginUser = (data) => {
    signInWithEmailAndPassword(auth, data.loginEmail, data.loginPassword)
      .then((userCredential) => {
        if (userCredential) {
          showToast("success", "Login successful!🚀");
          navigate("/profile");
        }
      })

      .catch((error) => {
        if (error.code === "auth/wrong-password") {
          showToast("error", "Wrong password!");
        }
        if (error.code === "auth/user-not-found") {
          showToast("error", "You are not registrated!");
        }
      });
  };

  const switchView = (value) => {
    setCreateAccount(!value);
    reset();
  };

  return (
    <Box sx={{ width: "100%", minHeight: "100vh" }}>
      <Grid container className={classes.authGridContainer}>
        <Grid item md={3} className={classes.authGridImage}>
          <img
            src={login}
            alt="Sign in to Invoicer"
            className={classes.authSvg}
          />
        </Grid>

        <Grid item md={9} xs={12} className={classes.authForm}>
          <img src={invoiceLogo} alt="Invoicer" className="w-[200px]" />

          {createAccount ? (
            <Box
              className={classes.authFormContainer}
              component="form"
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(signUpUser)}
            >
              {errors?.registerEmail && (
                <Typography style={{ color: "red" }}>
                  {errors.registerEmail.message}
                </Typography>
              )}
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                className={classes.inputField}
                {...register("registerEmail", {
                  required: "Please provide a valid email",
                  pattern: {
                    value: emailFormat,
                    message: "Provide valid email",
                  },
                })}
                type="email"
              />

              {errors?.registerPassword && (
                <Typography style={{ color: "red" }}>
                  {errors.registerPassword.message}
                </Typography>
              )}
              <TextField
                label="Password"
                autoComplete="off"
                type="password"
                variant="outlined"
                fullWidth
                className={classes.inputField}
                {...register("registerPassword", {
                  required: "Please enter a password",
                  minLength: {
                    value: 8,
                    message: "Your password must contain at least 8 characters",
                  },
                })}
              />

              <Button
                variant="contained"
                type="submit"
                color="primary"
                sx={{ width: "200px", fontSize: "16px", marginBottom: "15px" }}
              >
                REGISTER
              </Button>

              <Typography
                onClick={() => switchView(true)}
                style={{ cursor: "pointer" }}
              >
                Already have an account?{" "}
              </Typography>
            </Box>
          ) : (
            <Box
              className={classes.authFormContainer}
              component="form"
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(loginUser)}
            >
              {errors?.loginEmail && (
                <Typography style={{ color: "red" }}>
                  {errors.loginEmail.message}
                </Typography>
              )}
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                className={classes.inputField}
                {...register("loginEmail", {
                  required: "Please provide a valid email",
                  pattern: {
                    value: emailFormat,
                    message: "Enter a valid email",
                  },
                })}
                type="email"
              />

              {errors?.loginPassword && (
                <Typography style={{ color: "red" }}>
                  {errors.loginPassword.message}
                </Typography>
              )}
              <TextField
                label="Password"
                type="password"
                autoComplete="off"
                variant="outlined"
                fullWidth
                className={classes.inputField}
                {...register("loginPassword", {
                  required: "Please enter a password",
                  minLength: {
                    value: 8,
                    message: "Password must contain at least 8 characters",
                  },
                })}
              />

              <Button
                variant="contained"
                type="submit"
                color="primary"
                sx={{ width: "200px", fontSize: "16px", marginBottom: "15px" }}
              >
                SIGN IN
              </Button>

              <Typography
                onClick={() => switchView(false)}
                style={{ cursor: "pointer" }}
              >
                Create an Account?
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Auth;
