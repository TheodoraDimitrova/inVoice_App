import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import {
  canDeleteInvoiceLifecycle,
  canEditInvoiceLifecycle,
  INVOICE_STATUS,
  normalizeInvoiceLifecycleStatus,
} from "../utils/invoiceLifecycle";
import {
  deleteInvoiceById,
  markInvoicePaid,
} from "../features/invoice-create/services/invoiceService";
import { showToast } from "../utils/functions";
import { InvoiceSimpleConfirmDialog } from "./InvoiceSimpleConfirmDialog";

const DashboardActionsSvg = ({ invoiceId, invoiceData }) => {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [markPaidDialogOpen, setMarkPaidDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const status = normalizeInvoiceLifecycleStatus(invoiceData);
  const actionsLocked = busy || markPaidDialogOpen || deleteDialogOpen;

  function openDeleteDialog(event) {
    event.preventDefault();
    event.stopPropagation();
    if (!canDeleteInvoiceLifecycle(status)) {
      showToast("error", "Само чернови могат да се изтриват.");
      return;
    }
    setDeleteDialogOpen(true);
  }

  async function confirmDeleteDraft() {
    setBusy(true);
    try {
      await deleteInvoiceById(invoiceId);
      showToast("success", "Черновата е изтрита.");
      setDeleteDialogOpen(false);
    } catch (e) {
      console.error(e);
      showToast("error", "Грешка при изтриване.");
    } finally {
      setBusy(false);
    }
  }

  function handleEdit() {
    if (!canEditInvoiceLifecycle(status)) return;
    navigate(`/new/invoice/${invoiceId}`);
  }

  function openMarkPaidDialog(event) {
    event.preventDefault();
    event.stopPropagation();
    if (status !== INVOICE_STATUS.ISSUED) return;
    setMarkPaidDialogOpen(true);
  }

  async function confirmMarkInvoicePaid() {
    setBusy(true);
    try {
      await markInvoicePaid(invoiceId);
      showToast("success", "Фактурата е маркирана като платена.");
      setMarkPaidDialogOpen(false);
    } catch (e) {
      console.error(e);
      showToast(
        "error",
        "Неуспешно маркиране. Проверете връзката и правата във Firestore.",
      );
    } finally {
      setBusy(false);
    }
  }

  const deleteHidden = !canDeleteInvoiceLifecycle(status);
  const showEdit = canEditInvoiceLifecycle(status);
  const previewTitle = "Отваря преглед на фактурата.";
  const markPaidTitle = "Маркира фактурата като платена.";
  const deleteTitle = "Изтрива черновата.";
  const editTitle =
    status === INVOICE_STATUS.DRAFT
      ? "Редактирай черновата (клиент, редове, дати, издаване)."
      : "Редактирай издадената фактура (ограничени промени по документа).";

  return (
    <>
      <div className="flex max-w-[168px] flex-wrap items-center justify-end gap-0.5 sm:gap-1">
        <button
          type="button"
          aria-label={previewTitle}
          title={previewTitle}
          disabled={actionsLocked}
          onClick={() => navigate(`/invoices/${invoiceId}`)}
          className="inline-flex rounded-full p-1 text-[var(--color-brand-primary)] transition-colors hover:bg-[rgba(15,118,110,0.08)]"
        >
          <OpenInNewOutlinedIcon fontSize="small" />
        </button>
        {status === INVOICE_STATUS.ISSUED ? (
          <button
            type="button"
            aria-label={markPaidTitle}
            title={markPaidTitle}
            disabled={actionsLocked}
            onClick={openMarkPaidDialog}
            className="inline-flex rounded-full p-1 text-emerald-700 transition-colors hover:bg-emerald-500/15 disabled:opacity-40"
          >
            <TaskAltOutlinedIcon fontSize="small" />
          </button>
        ) : null}
        {showEdit ? (
          <button
            type="button"
            aria-label={editTitle}
            title={editTitle}
            disabled={actionsLocked}
            onClick={handleEdit}
            className="inline-flex rounded-full p-1 text-[var(--color-brand-charcoal)] transition-colors hover:bg-[rgba(15,23,42,0.06)] disabled:opacity-40"
          >
            <EditOutlinedIcon fontSize="small" />
          </button>
        ) : null}
        {!deleteHidden ? (
          <button
            type="button"
            aria-label={deleteTitle}
            title={deleteTitle}
            disabled={actionsLocked}
            onClick={openDeleteDialog}
            className="inline-flex rounded-full p-1 text-red-600 transition-colors hover:bg-[rgba(211,47,47,0.08)] disabled:opacity-40"
          >
            <DeleteOutlineOutlinedIcon fontSize="small" />
          </button>
        ) : null}
      </div>
      <InvoiceSimpleConfirmDialog
        open={markPaidDialogOpen}
        onClose={() => !busy && setMarkPaidDialogOpen(false)}
        title="Маркиране като платена"
        description="Фактурата ще получи статус „платена“ и вече няма да може да се редактира или изтрива. Потвърдете само ако плащането е налице."
        confirmLabel="Потвърди"
        onConfirm={confirmMarkInvoicePaid}
        busy={busy}
        confirmColor="primary"
        accent="success"
      />
      <InvoiceSimpleConfirmDialog
        open={deleteDialogOpen}
        onClose={() => !busy && setDeleteDialogOpen(false)}
        title="Изтриване на чернова"
        description="Черновата ще бъде премахната завинаги от списъка. Това действие не може да се отмени."
        confirmLabel="Изтрий"
        onConfirm={confirmDeleteDraft}
        busy={busy}
        busyLabel="Изтриване…"
        confirmColor="error"
        accent="danger"
      />
    </>
  );
};

export default DashboardActionsSvg;
