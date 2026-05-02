import React from "react";
import { Button } from "@mui/material";
import { Modal } from "../../../components/ui/layout";

export const InvoicePreviewDialog = ({ open, onClose, children }) => (
  <Modal
    open={open}
    onClose={onClose}
    title="Преглед на фактура"
    size="lg"
    footer={<Button onClick={onClose}>Затвори</Button>}
  >
    <div className="p-4">
      <div className="max-h-[72vh] overflow-auto rounded-xl bg-[#f8fafc] p-2 sm:p-3">
        {children}
      </div>
    </div>
  </Modal>
);
