import React from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
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
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 2.5 } }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 3,
            border: "1px solid rgba(15, 23, 42, 0.08)",
            bgcolor: "#fff",
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: 800, color: "var(--color-brand-primary)" }}
          >
            Създай фактура
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", mt: 0.75, mb: 3 }}
          >
            Попълнете данни за документа, клиента и продуктите.
          </Typography>

          <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <DocumentSection {...documentSectionProps} />
            <CustomerSection {...customerSectionProps} />
            <ProductsSection {...productsSectionProps} />
            <InvoiceNoteSection {...invoiceNoteSectionProps} />

            {showTotals && <TotalsSection {...totalsProps} />}

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.25}
              sx={{ mt: 1 }}
            >
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
            </Stack>
          </Box>
        </Paper>
      </Container>
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
