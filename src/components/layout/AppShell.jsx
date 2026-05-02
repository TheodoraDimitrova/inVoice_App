import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { logOut } from "../../redux/user";
import { showToast } from "../../utils/functions";
import {
  InvoiceCreationReadyProvider,
  useInvoiceCreationReady,
} from "../../contexts/InvoiceCreationReadyContext";
import { Sidebar, DRAWER_WIDTH } from "./Sidebar";
import { Header } from "./Header";
import { MobileDrawer } from "./MobileDrawer";

const AppShellContent = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSmDown, setIsSmDown] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 767px)").matches
      : false,
  );
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();
  const pathname = useLocation().pathname;
  const dispatch = useDispatch();

  const closeDrawerIfMobile = () => {
    if (isSmDown) setMobileOpen(false);
  };

  const { loading: invoiceGateLoading, ready: canCreateInvoice } =
    useInvoiceCreationReady();

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (user) => {
      setUserEmail(user?.email ?? "");
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setIsSmDown(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const signOutUser = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      dispatch(logOut());
      showToast("success", "Довиждане!👋");
      navigate("/");
    } catch (e) {
      console.error(e);
    }
  };

  const sidebar = (
    <Sidebar
      pathname={pathname}
      userEmail={userEmail}
      onNavClick={closeDrawerIfMobile}
    />
  );

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <div
        className="hidden w-[240px] shrink-0 border-r border-[var(--color-border-soft)] md:fixed md:inset-y-0 md:block"
        style={{ width: DRAWER_WIDTH }}
      >
        {sidebar}
      </div>

      <MobileDrawer open={Boolean(isSmDown && mobileOpen)} onClose={handleDrawerToggle}>
        {sidebar}
      </MobileDrawer>

      <main className="flex min-w-0 flex-1 flex-col md:ml-[240px]">
        <Header
          showMenuButton={isSmDown}
          onMenuClick={handleDrawerToggle}
          userEmail={userEmail}
          invoiceGateLoading={invoiceGateLoading}
          canCreateInvoice={canCreateInvoice}
          onNewInvoice={() => navigate("/invoices/new")}
          onSignOut={signOutUser}
        />
        <div className="flex-1 overflow-auto bg-[linear-gradient(180deg,#e6faf1_0%,#f8fafc_28%,#f8fafc_100%)]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const AppShell = () => (
  <InvoiceCreationReadyProvider>
    <AppShellContent />
  </InvoiceCreationReadyProvider>
);

export default AppShell;
