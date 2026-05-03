import React from "react";
import { Button } from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import { Modal } from "./ui/layout";

const footerButtonSx = { fontWeight: 700, textTransform: "none" };

const accentLeading = {
  success: (
    <span
      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"
      aria-hidden
    >
      <TaskAltOutlinedIcon sx={{ fontSize: 22 }} />
    </span>
  ),
  danger: (
    <span
      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-700"
      aria-hidden
    >
      <DeleteOutlineOutlinedIcon sx={{ fontSize: 22 }} />
    </span>
  ),
};

const InvoiceSimpleConfirmDialog = ({
  open,
  onClose,
  title,
  description,
  confirmLabel,
  onConfirm,
  busy = false,
  busyLabel = "Записване…",
  confirmColor = "primary",
  accent,
}) => {
  const leading = accent ? accentLeading[accent] : null;

  return (
    <Modal
      open={open}
      onClose={() => !busy && onClose()}
      title={title}
      leading={leading}
      size="confirm"
      footer={
        <>
          <Button onClick={onClose} disabled={busy} sx={footerButtonSx}>
            Отказ
          </Button>
          <Button
            variant="contained"
            color={confirmColor}
            onClick={onConfirm}
            disabled={busy}
            sx={footerButtonSx}
          >
            {busy ? busyLabel : confirmLabel}
          </Button>
        </>
      }
    >
      <div className="shrink-0 px-5 py-5 sm:px-6 sm:py-6">
        <p
          className={
            "text-[0.9375rem] font-normal leading-[1.65] tracking-[0.01em] " +
            "text-[var(--color-brand-charcoal)] antialiased [overflow-wrap:anywhere] [text-wrap:pretty] " +
            "sm:text-base"
          }
        >
          {description}
        </p>
      </div>
    </Modal>
  );
};

export { InvoiceSimpleConfirmDialog };
