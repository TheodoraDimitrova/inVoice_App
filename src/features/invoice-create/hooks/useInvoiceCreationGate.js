import { useEffect } from "react";
import { showToast } from "../../../utils/functions";

export const useInvoiceCreationGate = ({
  invoiceGateLoading,
  invoiceId,
  invoiceCreationReady,
  navigate,
}) => {
  useEffect(() => {
    if (invoiceGateLoading) return;
    if (!invoiceId && !invoiceCreationReady) {
      showToast(
        "error",
        'Добавете данъчни настройки (ДДС), фирмен идентификатор и банкови данни в "Профил", или включете "Не ми трябват банкови данни във фактурите".',
      );
      navigate("/profile", { replace: true });
    }
  }, [invoiceGateLoading, invoiceId, invoiceCreationReady, navigate]);
};
