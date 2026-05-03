import { useCallback } from "react";
import { serverTimestamp } from "@firebase/firestore";
import { auth } from "../../../firebase";
import { showToast } from "../../../utils/functions";
import { INVOICE_STATUS } from "../../../utils/invoiceLifecycle";
import { INVOICE_DUE_DAYS_AFTER_ISSUE } from "../constants/invoiceConstants";
import { addCalendarDaysToDateInput, toDateInput } from "../utils/date";
import { usePersistDraftInvoice } from "./usePersistDraftInvoice";
import { usePersistIssuedInvoice } from "./usePersistIssuedInvoice";

export const useInvoicePersistence = ({
  getValues,
  trigger,
  setValue,
  itemList,
  invoiceItems,
  isEditing,
  invoiceId,
  setProductsRequiredError,
  setSaveDialogOpen,
  setSaveInProgress,
  navigate,
  dispatch,
  invoiceLifecycleStatus,
}) => {
  const persistDraftInvoice = usePersistDraftInvoice({
    isEditing,
    invoiceId,
    dispatch,
  });
  const persistIssuedInvoice = usePersistIssuedInvoice({
    isEditing,
    invoiceId,
    dispatch,
  });

  return useCallback(
    async (action = "draft") => {
      setValue("itemList", itemList, { shouldDirty: true, shouldValidate: true });
      const hasInvoiceItems = invoiceItems.length > 0;
      setProductsRequiredError(!hasInvoiceItems);
      const isValid = await trigger();
      if (!isValid) {
        setSaveDialogOpen(false);
        return;
      }
      if (!hasInvoiceItems) {
        setSaveDialogOpen(false);
        showToast("error", "Добавете поне един артикул.");
        return;
      }

      if (
        isEditing &&
        invoiceLifecycleStatus === INVOICE_STATUS.ISSUED &&
        action === "draft"
      ) {
        setSaveDialogOpen(false);
        showToast(
          "error",
          "Издадена фактура не може да се връща към чернова.",
        );
        return;
      }

      if (isEditing && invoiceLifecycleStatus === INVOICE_STATUS.PAID) {
        setSaveDialogOpen(false);
        showToast("error", "Платена фактура не може да се променя.");
        return;
      }

      setSaveInProgress(true);
      const formData = getValues();
      const isIssued = action === "issued";
      const issueDateToPersist =
        (formData.issueDate || "").trim() || toDateInput(new Date());
      const dueDateToPersist =
        (formData.dueDate || "").trim() ||
        addCalendarDaysToDateInput(
          issueDateToPersist,
          INVOICE_DUE_DAYS_AFTER_ISSUE,
        );

      const basePayload = {
        user_id: auth.currentUser.uid,
        customerName: formData.customerName,
        customerType: formData.customerType,
        customerAddress: formData.customerAddress,
        customerPostCode: formData.customerPostCode,
        customerCity: formData.customerCity,
        customerCountry: formData.customerCountry,
        customerEmail: formData.customerEmail,
        companyIdentifier: formData.companyIdentifier || "",
        customerVatRegistered: formData.customerVatRegistered,
        customerVatNumber: formData.customerVatNumber || "",
        includeInvoiceNote: Boolean(formData.includeInvoiceNote),
        invoiceNote: formData.includeInvoiceNote
          ? String(formData.invoiceNote || "").trim()
          : "",
        currency: formData.currency,
        itemList: invoiceItems,
        issueDate: issueDateToPersist,
        dueDate: dueDateToPersist,
        status: isIssued ? "issued" : "draft",
        finalizedAt: isIssued ? serverTimestamp() : null,
        ...(isEditing
          ? { updatedAt: serverTimestamp() }
          : { timestamp: serverTimestamp() }),
      };

      try {
        if (isIssued) {
          await persistIssuedInvoice({ basePayload, formData, invoiceItems });
        } else {
          await persistDraftInvoice({ basePayload, formData, invoiceItems });
        }

        const updatingIssuedOnly =
          isIssued &&
          isEditing &&
          invoiceLifecycleStatus === INVOICE_STATUS.ISSUED;

        showToast(
          "success",
          updatingIssuedOnly
            ? "Промените по издадената фактура са запазени."
            : isIssued
              ? "Фактурата е издадена успешно!📜"
              : "Черновата е запазена успешно.",
        );
        setSaveDialogOpen(false);
        navigate("/dashboard");
      } catch (err) {
        console.error(err);
        showToast("error", "Грешка при запазване. Опитайте отново.");
      } finally {
        setSaveInProgress(false);
      }
    },
    [
      getValues,
      trigger,
      setValue,
      itemList,
      invoiceItems,
      setProductsRequiredError,
      setSaveDialogOpen,
      setSaveInProgress,
      navigate,
      persistDraftInvoice,
      persistIssuedInvoice,
      invoiceLifecycleStatus,
      isEditing,
    ],
  );
};
