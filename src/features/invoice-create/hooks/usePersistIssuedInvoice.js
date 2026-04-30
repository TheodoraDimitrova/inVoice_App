import { useCallback } from "react";
import { collection, getDocs, query, where } from "@firebase/firestore";
import db, { auth } from "../../../firebase";
import { useCreateIssuedInvoice } from "./useCreateIssuedInvoice";
import { useEditIssuedInvoice } from "./useEditIssuedInvoice";

async function getNextBusinessInvoiceNumber() {
  const businessRef = query(
    collection(db, "businesses"),
    where("user_id", "==", auth.currentUser.uid),
  );
  const businessSnapshot = await getDocs(businessRef);
  let businessDocId = "";
  let generatedInvoiceNumber = null;
  businessSnapshot.forEach((businessDoc) => {
    businessDocId = businessDoc.id;
    generatedInvoiceNumber = (Number(businessDoc.data().invoices) || 0) + 1;
  });
  return { businessDocId, generatedInvoiceNumber };
}

export const usePersistIssuedInvoice = ({ isEditing, invoiceId, dispatch }) =>
  {
    const createIssuedInvoice = useCreateIssuedInvoice({
      getNextBusinessInvoiceNumber,
      dispatch,
    });
    const editIssuedInvoice = useEditIssuedInvoice({
      getNextBusinessInvoiceNumber,
      invoiceId,
    });

    return useCallback(
      async ({ basePayload, formData, invoiceItems }) => {
        if (isEditing) {
          await editIssuedInvoice({ basePayload });
          return;
        }

        await createIssuedInvoice({ basePayload, formData, invoiceItems });
      },
      [createIssuedInvoice, editIssuedInvoice, isEditing],
    );
  };
