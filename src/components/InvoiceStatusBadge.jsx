import React from "react";
import { Chip } from "@mui/material";
import DraftsOutlinedIcon from "@mui/icons-material/DraftsOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import {
  INVOICE_STATUS,
  normalizeInvoiceLifecycleStatus,
} from "../utils/invoiceLifecycle";

const CONFIG = {
  [INVOICE_STATUS.DRAFT]: {
    label: "Чернова",
    chipColor: "warning",
    pillClass:
      "border border-amber-300/80 bg-amber-50 text-amber-900 shadow-sm shadow-amber-900/5",
    Icon: DraftsOutlinedIcon,
  },
  [INVOICE_STATUS.ISSUED]: {
    label: "Издадена",
    chipColor: "info",
    pillClass:
      "border border-sky-300/80 bg-sky-50 text-sky-900 shadow-sm shadow-sky-900/5",
    Icon: ReceiptLongOutlinedIcon,
  },
  [INVOICE_STATUS.PAID]: {
    label: "Платена",
    chipColor: "success",
    pillClass:
      "border border-emerald-300/80 bg-emerald-50 text-emerald-900 shadow-sm shadow-emerald-900/5",
    Icon: TaskAltOutlinedIcon,
  },
};

/**
 * @param {"chip" | "pill"} variant — Chip (MUI) или компактен pill за таблици / печат
 */
export function InvoiceStatusBadge({
  invoiceData,
  status: statusProp,
  variant = "chip",
  size = "small",
  className = "",
}) {
  const status =
    statusProp ?? normalizeInvoiceLifecycleStatus(invoiceData ?? {});
  const cfg = CONFIG[status] ?? CONFIG[INVOICE_STATUS.ISSUED];
  const Icon = cfg.Icon;

  if (variant === "pill") {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide tabular-nums ${cfg.pillClass} ${className}`}
      >
        <Icon sx={{ fontSize: 14 }} aria-hidden />
        {cfg.label}
      </span>
    );
  }

  return (
    <Chip
      icon={<Icon sx={{ fontSize: "18px !important" }} />}
      label={cfg.label}
      color={cfg.chipColor}
      size={size}
      variant="filled"
      className={className}
      sx={{
        fontWeight: 700,
        letterSpacing: "0.02em",
        "& .MuiChip-icon": {
          marginLeft: "10px",
          color: "inherit",
          opacity: 0.95,
        },
        "& .MuiChip-label": {
          px: 1,
          fontSize: size === "medium" ? "0.8125rem" : "0.75rem",
        },
      }}
    />
  );
}
