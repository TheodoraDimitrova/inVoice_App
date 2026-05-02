import { useCallback, useMemo, useState } from "react";
import { showToast } from "../../../utils/functions";
import {
  deleteCustomerForCurrentUser,
  fetchCustomersForCurrentUser,
} from "../services/customersService";

export const useCustomersData = () => {
  const [customers, setCustomers] = useState([]);

  const refreshCustomers = useCallback(async () => {
    try {
      const fetched = await fetchCustomersForCurrentUser();
      setCustomers(fetched);
    } catch {
      showToast("error", "Моля, свържете се с техническа поддръжка.");
    }
  }, []);

  const sortedCustomers = useMemo(
    () =>
      [...customers].sort((a, b) =>
        String(a?.customerName || "").localeCompare(
          String(b?.customerName || ""),
          "bg",
        ),
      ),
    [customers],
  );

  const deleteCustomer = useCallback(async (customerId) => {
    try {
      await deleteCustomerForCurrentUser(customerId);
      showToast("success", "Клиентът е изтрит успешно.");
      return true;
    } catch {
      showToast("error", "Моля, свържете се с техническа поддръжка.");
      return false;
    }
  }, []);

  return { customers, sortedCustomers, refreshCustomers, deleteCustomer };
};
