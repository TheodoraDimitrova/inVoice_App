import React from "react";
import { useNavigate } from "react-router-dom";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { showToast } from "../utils/functions";

const DashboardActionsSvg = ({ invoiceId }) => {
  const navigate = useNavigate();

  function deleteInvoice() {
    showToast("error", "Изтриването на фактури не е позволено. Свържете се с поддръжката.🚀");
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        aria-label="Преглед на фактура"
        onClick={() => navigate(`/invoices/${invoiceId}`)}
        className="inline-flex rounded-full p-1 text-[var(--color-brand-primary)] transition-colors hover:bg-[rgba(15,118,110,0.08)]"
      >
        <OpenInNewOutlinedIcon fontSize="small" />
      </button>
      <button
        type="button"
        aria-label="Изтрий фактура"
        onClick={deleteInvoice}
        className="inline-flex rounded-full p-1 text-red-600 transition-colors hover:bg-[rgba(211,47,47,0.08)]"
      >
        <DeleteOutlineOutlinedIcon fontSize="small" />
      </button>
      <button
        type="button"
        aria-label="Редакция на фактура"
        onClick={() => navigate(`/new/invoice/${invoiceId}`)}
        className="inline-flex rounded-full p-1 text-[var(--color-brand-charcoal)] transition-colors hover:bg-[rgba(15,23,42,0.06)]"
      >
        <EditOutlinedIcon fontSize="small" />
      </button>
    </div>
  );
};

export default DashboardActionsSvg;
