import { useCallback } from "react";
import {
  createCustomerForCurrentUser,
  updateCustomerForCurrentUser,
} from "../services/customersService";
import { toCustomerPayload } from "../mappers/customerPayloadMapper";

export const useCustomerCrud = () => {
  const saveCustomer = useCallback(async ({ editingId, customerData }) => {
    const payload = toCustomerPayload(customerData);

    if (editingId) {
      await updateCustomerForCurrentUser(editingId, payload);
    } else {
      await createCustomerForCurrentUser(payload);
    }
  }, []);

  return { saveCustomer };
};
