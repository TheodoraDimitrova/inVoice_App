import { useEffect, useState } from "react";

import { fetchCustomersForCurrentUser } from "../../customers/services/customersService";

export function useInvoiceSavedCustomers() {
  const [savedCustomers, setSavedCustomers] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await fetchCustomersForCurrentUser();
        if (!cancelled) setSavedCustomers(Array.isArray(list) ? list : []);
      } catch {
        if (!cancelled) setSavedCustomers([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { savedCustomers };
}
