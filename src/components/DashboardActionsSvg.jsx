import React from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, Stack } from "@mui/material";
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
    <Stack direction="row" spacing={0.5} justifyContent="flex-end" alignItems="center">
      <IconButton
        size="small"
        aria-label="Преглед на фактура"
        onClick={() => navigate(`/invoices/${invoiceId}`)}
        sx={{
          color: "var(--color-brand-primary)",
          "&:hover": { bgcolor: "rgba(15, 118, 110, 0.08)" },
        }}
      >
        <OpenInNewOutlinedIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        aria-label="Изтрий фактура"
        onClick={deleteInvoice}
        sx={{
          color: "error.main",
          "&:hover": { bgcolor: "rgba(211, 47, 47, 0.08)" },
        }}
      >
        <DeleteOutlineOutlinedIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        aria-label="Редакция на фактура"
        onClick={() => navigate(`/new/invoice/${invoiceId}`)}
        sx={{
          color: "var(--color-brand-charcoal)",
          "&:hover": { bgcolor: "rgba(15, 23, 42, 0.06)" },
        }}
      >
        <EditOutlinedIcon fontSize="small" />
      </IconButton>
    </Stack>
  );
};

export default DashboardActionsSvg;
