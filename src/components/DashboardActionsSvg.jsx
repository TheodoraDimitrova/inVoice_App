import React from "react";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import { useInvoiceRowActions } from "../features/invoices/hooks/useInvoiceRowActions";
import { InvoiceSimpleConfirmDialog } from "./InvoiceSimpleConfirmDialog";

const DashboardActionsSvg = ({ invoiceId, invoiceData }) => {
  const actions = useInvoiceRowActions(invoiceId, invoiceData);

  return (
    <>
      <div className="flex max-w-[168px] flex-wrap items-center justify-end gap-0.5 sm:gap-1">
        <button
          type="button"
          aria-label={actions.previewTitle}
          title={actions.previewTitle}
          disabled={actions.actionsLocked}
          onClick={actions.onPreviewClick}
          className="inline-flex rounded-full p-1 text-[var(--color-brand-primary)] transition-colors hover:bg-[rgba(15,118,110,0.08)]"
        >
          <OpenInNewOutlinedIcon fontSize="small" />
        </button>
        {actions.showMarkPaidButton ? (
          <button
            type="button"
            aria-label={actions.markPaidTitle}
            title={actions.markPaidTitle}
            disabled={actions.actionsLocked}
            onClick={actions.onMarkPaidButtonClick}
            className="inline-flex rounded-full p-1 text-emerald-700 transition-colors hover:bg-emerald-500/15 disabled:opacity-40"
          >
            <TaskAltOutlinedIcon fontSize="small" />
          </button>
        ) : null}
        {actions.showEditButton ? (
          <button
            type="button"
            aria-label={actions.editTitle}
            title={actions.editTitle}
            disabled={actions.actionsLocked}
            onClick={actions.onEditClick}
            className="inline-flex rounded-full p-1 text-[var(--color-brand-charcoal)] transition-colors hover:bg-[rgba(15,23,42,0.06)] disabled:opacity-40"
          >
            <EditOutlinedIcon fontSize="small" />
          </button>
        ) : null}
        {actions.showDeleteButton ? (
          <button
            type="button"
            aria-label={actions.deleteTitle}
            title={actions.deleteTitle}
            disabled={actions.actionsLocked}
            onClick={actions.onDeleteButtonClick}
            className="inline-flex rounded-full p-1 text-red-600 transition-colors hover:bg-[rgba(211,47,47,0.08)] disabled:opacity-40"
          >
            <DeleteOutlineOutlinedIcon fontSize="small" />
          </button>
        ) : null}
      </div>
      <InvoiceSimpleConfirmDialog
        open={actions.markPaidDialogOpen}
        onClose={actions.onCloseMarkPaidDialog}
        title="Маркиране като платена"
        description="Фактурата ще получи статус „платена“ и вече няма да може да се редактира или изтрива. Потвърдете само ако плащането е налице."
        confirmLabel="Потвърди"
        onConfirm={actions.confirmMarkInvoicePaid}
        busy={actions.busy}
        confirmColor="primary"
        accent="success"
      />
      <InvoiceSimpleConfirmDialog
        open={actions.deleteDialogOpen}
        onClose={actions.onCloseDeleteDialog}
        title="Изтриване на чернова"
        description="Черновата ще бъде премахната завинаги от списъка. Това действие не може да се отмени."
        confirmLabel="Изтрий"
        onConfirm={actions.confirmDeleteDraft}
        busy={actions.busy}
        busyLabel="Изтриване…"
        confirmColor="error"
        accent="danger"
      />
    </>
  );
};

export default DashboardActionsSvg;
