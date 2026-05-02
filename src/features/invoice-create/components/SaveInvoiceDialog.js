import React from "react";
import { Button } from "@mui/material";
import { Modal } from "../../../components/ui/layout";

export const SaveInvoiceDialog = ({
  open,
  onClose,
  onSaveDraft,
  onIssue,
  saveInProgress = false,
}) => (
  <Modal
    open={open}
    onClose={() => !saveInProgress && onClose()}
    title="Как искате да запазите фактурата?"
    size="sm"
    footer={
      <>
        <Button onClick={onClose} disabled={saveInProgress}>
          Отказ
        </Button>
        <Button variant="outlined" onClick={onSaveDraft} disabled={saveInProgress}>
          Запази като чернова
        </Button>
        <Button variant="contained" onClick={onIssue} disabled={saveInProgress}>
          Издай фактурата
        </Button>
      </>
    }
  >
    <div className="p-5">
      <p className="text-sm text-slate-600">
        Изберете дали да издадете официална фактура с пореден номер, или да
        запазите като чернова за по-късно.
      </p>
    </div>
  </Modal>
);
