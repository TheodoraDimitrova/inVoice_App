import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  canDeleteInvoiceLifecycle,
  canEditInvoiceLifecycle,
  canMarkInvoicePaid,
  INVOICE_STATUS,
  normalizeInvoiceLifecycleStatus,
} from "../../../utils/invoiceLifecycle";
import {
  deleteInvoiceById,
  markInvoicePaid,
} from "../../invoice-create/services/invoiceService";
import { showToast } from "../../../utils/functions";

/**
 * Оркестрация за действията върху ред фактура (табло / списък):
 * навигация, домейн проверки, повиквания към услуги.
 * UI компонентът само визуализира върнатите флагове и handlers.
 */
export function useInvoiceRowActions(invoiceId, invoiceData) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [markPaidDialogOpen, setMarkPaidDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const status = normalizeInvoiceLifecycleStatus(invoiceData);
  const actionsLocked = busy || markPaidDialogOpen || deleteDialogOpen;

  const showDeleteButton = canDeleteInvoiceLifecycle(status);
  const showEditButton = canEditInvoiceLifecycle(status);
  const showMarkPaidButton = canMarkInvoicePaid(invoiceData);

  const previewTitle = "Отваря преглед на фактурата.";
  const markPaidTitle = "Маркира фактурата като платена.";
  const deleteTitle = "Изтрива черновата.";
  const editTitle =
    status === INVOICE_STATUS.DRAFT
      ? "Редактирай черновата (клиент, редове, дати, издаване)."
      : "Редактирай издадената фактура (ограничени промени по документа).";

  const onPreviewClick = useCallback(() => {
    if (!invoiceId) return;
    navigate(`/invoices/${invoiceId}`);
  }, [invoiceId, navigate]);

  const onEditClick = useCallback(() => {
    if (!invoiceId || !canEditInvoiceLifecycle(status)) return;
    navigate(`/new/invoice/${invoiceId}`);
  }, [invoiceId, navigate, status]);

  const onDeleteButtonClick = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!canDeleteInvoiceLifecycle(status)) {
        showToast("error", "Само чернови могат да се изтриват.");
        return;
      }
      setDeleteDialogOpen(true);
    },
    [status],
  );

  const onMarkPaidButtonClick = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!canMarkInvoicePaid(invoiceData)) return;
      setMarkPaidDialogOpen(true);
    },
    [invoiceData],
  );

  const confirmDeleteDraft = useCallback(async () => {
    if (!invoiceId) return;
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
  }, [invoiceId]);

  const confirmMarkInvoicePaid = useCallback(async () => {
    if (!invoiceId) return;
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
  }, [invoiceId]);

  const onCloseMarkPaidDialog = useCallback(() => {
    if (!busy) setMarkPaidDialogOpen(false);
  }, [busy]);

  const onCloseDeleteDialog = useCallback(() => {
    if (!busy) setDeleteDialogOpen(false);
  }, [busy]);

  return {
    actionsLocked,
    busy,
    markPaidDialogOpen,
    deleteDialogOpen,
    showDeleteButton,
    showEditButton,
    showMarkPaidButton,
    previewTitle,
    markPaidTitle,
    deleteTitle,
    editTitle,
    onPreviewClick,
    onEditClick,
    onDeleteButtonClick,
    onMarkPaidButtonClick,
    confirmDeleteDraft,
    confirmMarkInvoicePaid,
    onCloseMarkPaidDialog,
    onCloseDeleteDialog,
  };
}
