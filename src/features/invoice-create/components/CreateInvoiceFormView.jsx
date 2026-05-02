import React from "react";
import { Button } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Loading from "../../../components/Loading";
import {
  DocumentSection,
  CustomerSection,
  ProductsSection,
  InvoiceNoteSection,
  TotalsSection,
  SaveInvoiceDialog,
  InvoicePreviewDialog,
} from ".";

const CreateInvoiceFormView = ({
  loading,
  invoiceGateLoading,
  blockNewInvoice,
  documentSectionProps,
  customerSectionProps,
  productsSectionProps,
  invoiceNoteSectionProps,
  showTotals,
  totalsProps,
  onPreview,
  onOpenSaveDialog,
  saveDialogOpen,
  onCloseSaveDialog,
  onSaveDraft,
  onIssue,
  saveInProgress,
  previewModalOpen,
  onClosePreview,
  previewContent,
}) => (
  <>
    {loading || invoiceGateLoading || blockNewInvoice ? (
      <Loading />
    ) : (
      <main className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-6">
        <section className="rounded-3xl border border-[rgba(15,23,42,0.08)] bg-white p-4 sm:p-6">
          <h1 className="text-2xl font-extrabold text-[var(--color-brand-primary)]">
            Създай фактура
          </h1>
          <p className="mb-8 mt-2 text-sm text-slate-500">
            Попълнете данни за документа, клиента и продуктите.
          </p>

          <form className="flex flex-col gap-6">
            <DocumentSection {...documentSectionProps} />
            <CustomerSection {...customerSectionProps} />
            <ProductsSection {...productsSectionProps} />
            <InvoiceNoteSection {...invoiceNoteSectionProps} />

            {showTotals && <TotalsSection {...totalsProps} />}

            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outlined"
                color="primary"
                size="large"
                onClick={onPreview}
                startIcon={<VisibilityOutlinedIcon />}
                sx={{ height: 48, fontWeight: 700, minWidth: { sm: 180 } }}
              >
                Преглед
              </Button>
              <Button
                type="button"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                sx={{ height: 48, fontWeight: 700 }}
                onClick={onOpenSaveDialog}
              >
                ЗАПАЗИ ФАКТУРА
              </Button>
            </div>
          </form>
        </section>
      </main>
    )}

    <SaveInvoiceDialog
      open={saveDialogOpen}
      onClose={onCloseSaveDialog}
      onSaveDraft={onSaveDraft}
      onIssue={onIssue}
      saveInProgress={saveInProgress}
    />
    <InvoicePreviewDialog open={previewModalOpen} onClose={onClosePreview}>
      {previewContent}
    </InvoicePreviewDialog>
  </>
);

export default CreateInvoiceFormView;
