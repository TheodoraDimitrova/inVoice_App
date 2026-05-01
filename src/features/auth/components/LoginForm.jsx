import React from "react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { outlinedFieldLabelProps, outlinedFieldSx } from "../../../utils/muiFieldSx";
import { FormFieldHelperText } from "../../../components/FormFieldHelperText";
import { EMAIL_REGEX } from "../utils/authErrors";

const switchLinkClass =
  "mt-5 w-full text-center text-sm font-medium bg-transparent border-0 cursor-pointer p-0 text-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary-hover)] hover:underline underline-offset-2 transition-colors";

const LoginForm = ({
  register,
  handleSubmit,
  errors,
  onSubmit,
  onGoogleLogin,
  onForgotPassword,
  onSwitchToRegister,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "stretch" }}
    >
      <TextField
        label="Имейл"
        variant="outlined"
        fullWidth
        size="medium"
        type="email"
        InputLabelProps={outlinedFieldLabelProps}
        sx={outlinedFieldSx}
        error={Boolean(errors?.loginEmail)}
        helperText={
          <FormFieldHelperText
            errorMessage={errors?.loginEmail?.message}
            hint="Моля, въведете вашия имейл."
          />
        }
        FormHelperTextProps={{ component: "div" }}
        {...register("loginEmail", {
          required: "Моля, въведете валиден имейл",
          pattern: { value: EMAIL_REGEX, message: "Въведете валиден имейл" },
        })}
      />

      <TextField
        label="Парола"
        type={showPassword ? "text" : "password"}
        autoComplete="current-password"
        variant="outlined"
        fullWidth
        size="medium"
        InputLabelProps={outlinedFieldLabelProps}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={showPassword ? "Скрий парола" : "Покажи парола"}
                onClick={() => setShowPassword((p) => !p)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={outlinedFieldSx}
        error={Boolean(errors?.loginPassword)}
        helperText={
          <FormFieldHelperText errorMessage={errors?.loginPassword?.message} />
        }
        FormHelperTextProps={{ component: "div" }}
        {...register("loginPassword", {
          required: "Моля, въведете парола",
          minLength: { value: 8, message: "Паролата трябва да е поне 8 символа" },
        })}
      />

      <Button variant="contained" color="primary" type="submit" fullWidth size="large" sx={{ mt: 1, mb: 0, py: 1.25 }}>
        Вход
      </Button>
      <Button variant="text" onClick={onForgotPassword} sx={{ mt: 1, alignSelf: "center", textTransform: "none" }}>
        Забравена парола?
      </Button>
      <Divider sx={{ my: 2 }}>или</Divider>
      <Button variant="outlined" fullWidth size="large" onClick={onGoogleLogin} sx={{ py: 1.25 }}>
        Продължи с Google
      </Button>
      <button type="button" className={switchLinkClass} onClick={onSwitchToRegister}>
        Създай акаунт
      </button>
    </Box>
  );
};

export default LoginForm;
