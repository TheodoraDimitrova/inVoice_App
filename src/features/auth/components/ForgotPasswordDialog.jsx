import React from "react";
import {
  Button,
  TextField,
} from "@mui/material";
import { outlinedFieldLabelProps, outlinedFieldSx } from "../../../utils/muiFieldSx";
import { Modal } from "../../../components/ui/layout";

const ForgotPasswordDialog = ({ open, onClose, email, onEmailChange, onSubmit, loading }) => (
  <Modal
    open={open}
    onClose={onClose}
    title="Възстановяване на парола"
    size="xs"
    footer={
      <>
        <Button onClick={onClose} disabled={loading}>
          Отказ
        </Button>
        <Button variant="contained" onClick={onSubmit} disabled={loading}>
          Изпрати линк
        </Button>
      </>
    }
  >
    <div className="p-5">
      <p className="mb-4 text-sm text-slate-500">
        Въведете имейла си и ще получите линк за смяна на паролата.
      </p>
      <TextField
        autoFocus
        label="Имейл"
        type="email"
        fullWidth
        size="medium"
        InputLabelProps={outlinedFieldLabelProps}
        sx={{ ...outlinedFieldSx, mb: 0 }}
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
      />
    </div>
  </Modal>
);

export default ForgotPasswordDialog;
