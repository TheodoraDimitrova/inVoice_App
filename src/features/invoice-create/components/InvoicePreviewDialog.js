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
    <div className="px-3 py-3 sm:p-4 md:px-6 md:pb-5">
      <div className="max-h-[72vh] overflow-auto rounded-xl bg-[#f8fafc] p-3 sm:p-4 md:p-6">
        {children}
      </div>
    </div>
  </Modal>
);
