import React, { useCallback, useMemo, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import Loading from "../../../components/Loading";
import { InvoiceSimpleConfirmDialog } from "../../../components/InvoiceSimpleConfirmDialog";
import ViewInvoicePage from "../components/ViewInvoicePage";
import { useInvoiceData } from "../hooks/useInvoiceData";
import { useBusinessData } from "../hooks/useBusinessData";
import {
  canMarkInvoicePaid,
  getInvoiceStatusBadgePresentation,
  isInvoiceLifecyclePaid,
} from "../../../utils/invoiceLifecycle";
import { markInvoicePaid } from "../../invoice-create/services/invoiceService";
import { showToast } from "../../../utils/functions";

export const ViewInvoiceContainer = () => {
  const { id } = useParams();
  const location = useLocation();
  const previewData = location.state?.previewData || null;

  const { invoice, loading: invoiceLoading } = useInvoiceData(id, previewData);
  const { business, loading: businessLoading } = useBusinessData();
  const componentRef = useRef(null);
  const [markPaidBusy, setMarkPaidBusy] = useState(false);
  const [markPaidDialogOpen, setMarkPaidDialogOpen] = useState(false);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const canMarkPaid =
    Boolean(id) && !previewData && canMarkInvoicePaid(invoice);
  const showPaidBanner = !previewData && isInvoiceLifecyclePaid(invoice);

  const invoiceStatusBadge = useMemo(
    () => (invoice ? getInvoiceStatusBadgePresentation(invoice) : null),
    [invoice],
  );

  const confirmMarkInvoicePaid = useCallback(async () => {
    if (!id) return;
    setMarkPaidBusy(true);
    try {
      await markInvoicePaid(id);
      showToast("success", "Фактурата е маркирана като платена.");
      setMarkPaidDialogOpen(false);
    } catch (e) {
      console.error(e);
      showToast("error", "Грешка при обновяване на статуса.");
    } finally {
      setMarkPaidBusy(false);
    }
  }, [id]);

  if (invoiceLoading || businessLoading) return <Loading />;

  return (
    <>
      <ViewInvoicePage
        invoice={invoice}
        invoiceStatusBadge={invoiceStatusBadge}
        business={business}
        printRef={componentRef}
        onPrint={handlePrint}
        isPreview={Boolean(previewData)}
        showPaidBanner={showPaidBanner}
        canMarkPaid={canMarkPaid}
        markPaidBusy={markPaidBusy}
        markPaidActionsDisabled={markPaidBusy || markPaidDialogOpen}
        onMarkPaid={() => setMarkPaidDialogOpen(true)}
      />
      <InvoiceSimpleConfirmDialog
        open={markPaidDialogOpen}
        onClose={() => !markPaidBusy && setMarkPaidDialogOpen(false)}
        title="Маркиране като платена"
        description="Фактурата ще получи статус „платена“ и вече няма да може да се редактира или изтрива. Потвърдете само ако плащането е налице."
        confirmLabel="Потвърди"
        onConfirm={confirmMarkInvoicePaid}
        busy={markPaidBusy}
        confirmColor="primary"
        accent="success"
      />
    </>
  );
};

export default ViewInvoiceContainer;
