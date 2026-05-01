import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

export const SaveInvoiceDialog = ({
  open,
  onClose,
  onSaveDraft,
  onIssue,
  saveInProgress = false,
}) => (
  <Dialog open={open} onClose={() => !saveInProgress && onClose()} maxWidth="sm" fullWidth>
    <DialogTitle>Как искате да запазите фактурата?</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Изберете дали да издадете официална фактура с пореден номер, или да
        запазите като чернова за по-късно.
      </DialogContentText>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2.5, pt: 0.5, gap: 1 }}>
      <Button onClick={onClose} disabled={saveInProgress}>
        Отказ
      </Button>
      <Button variant="outlined" onClick={onSaveDraft} disabled={saveInProgress}>
        Запази като чернова
      </Button>
      <Button variant="contained" onClick={onIssue} disabled={saveInProgress}>
        Издай фактурата
      </Button>
    </DialogActions>
  </Dialog>
);
