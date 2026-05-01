import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { outlinedFieldLabelProps, outlinedFieldSx } from "../../../utils/muiFieldSx";

const ForgotPasswordDialog = ({ open, onClose, email, onEmailChange, onSubmit, loading }) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
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
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
      />
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2.5 }}>
      <Button onClick={onClose} disabled={loading}>
        Отказ
      </Button>
      <Button variant="contained" onClick={onSubmit} disabled={loading}>
        Изпрати линк
      </Button>
    </DialogActions>
  </Dialog>
);

export default ForgotPasswordDialog;
