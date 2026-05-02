import React from "react";
import {
  Button,
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

const RegisterForm = ({
  register,
  handleSubmit,
  errors,
  onSubmit,
  onGoogleLogin,
  onSwitchToLogin,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <form
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col items-stretch"
    >
      <TextField
        label="Имейл"
        variant="outlined"
        fullWidth
        size="medium"
        type="email"
        InputLabelProps={outlinedFieldLabelProps}
        sx={outlinedFieldSx}
        error={Boolean(errors?.registerEmail)}
        helperText={
          <FormFieldHelperText
            errorMessage={errors?.registerEmail?.message}
            hint="Моля, въведете вашия имейл."
          />
        }
        FormHelperTextProps={{ component: "div" }}
        {...register("registerEmail", {
          required: "Моля, въведете валиден имейл",
          pattern: { value: EMAIL_REGEX, message: "Въведете валиден имейл" },
        })}
      />

      <TextField
        label="Парола"
        autoComplete="new-password"
        type={showPassword ? "text" : "password"}
        variant="outlined"
        fullWidth
        size="medium"
        InputLabelProps={outlinedFieldLabelProps}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <button
                type="button"
                aria-label={showPassword ? "Скрий парола" : "Покажи парола"}
                onClick={() => setShowPassword((p) => !p)}
                className="inline-flex rounded-full p-2 text-slate-600 hover:bg-slate-100"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </button>
            </InputAdornment>
          ),
        }}
        sx={outlinedFieldSx}
        error={Boolean(errors?.registerPassword)}
        helperText={
          <FormFieldHelperText
            errorMessage={errors?.registerPassword?.message}
            hint="Минимум 8 символа."
          />
        }
        FormHelperTextProps={{ component: "div" }}
        {...register("registerPassword", {
          required: "Моля, въведете парола",
          minLength: { value: 8, message: "Паролата трябва да е поне 8 символа" },
        })}
      />

      <Button variant="contained" color="primary" type="submit" fullWidth size="large" sx={{ mt: 1, mb: 0, py: 1.25 }}>
        Регистрация
      </Button>
      <div className="my-4 flex items-center gap-3 text-sm text-slate-500">
        <span className="h-px flex-1 bg-slate-200" />
        <span>или</span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>
      <Button variant="outlined" fullWidth size="large" onClick={onGoogleLogin} sx={{ py: 1.25 }}>
        Продължи с Google
      </Button>
      <button type="button" className={switchLinkClass} onClick={onSwitchToLogin}>
        Вече имате акаунт? Влезте
      </button>
    </form>
  );
};

export default RegisterForm;
