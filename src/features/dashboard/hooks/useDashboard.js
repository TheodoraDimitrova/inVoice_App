import { useEffect, useMemo, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { buildDashboardViewModel, subscribeDashboard } from "../services/dashboardService";

const EMPTY_SNAPSHOT = {
  uid: "",
  invoices: [],
  business: null,
  status: "loading",
  source: "realtime",
  streams: {
    invoices: "loading",
    business: "loading",
  },
};

export function useDashboard() {
  const [uid, setUid] = useState(() => getAuth().currentUser?.uid || "");
  const [snapshot, setSnapshot] = useState(EMPTY_SNAPSHOT);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      setUid(user?.uid || "");
      if (!user?.uid) {
        setSnapshot(EMPTY_SNAPSHOT);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!uid) return undefined;
    return subscribeDashboard(uid, setSnapshot);
  }, [uid]);

  const viewModel = useMemo(() => buildDashboardViewModel(snapshot), [snapshot]);
  return viewModel;
}
