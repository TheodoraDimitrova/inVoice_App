import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AddIcon from "@mui/icons-material/Add";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { logOut } from "../redux/user";
import { showToast } from "../utils/functions";
import {
  InvoiceCreationReadyProvider,
  useInvoiceCreationReady,
} from "../contexts/InvoiceCreationReadyContext";

const DRAWER_WIDTH = 240;

const navShellClass =
  "mx-2 mb-1 flex w-[calc(100%-1rem)] items-center gap-3 rounded-2xl border-0 px-3 py-2 text-left text-[0.9375rem] font-[inherit] no-underline outline-none transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-brand-primary)]";

const navInactiveClass = `${navShellClass} bg-transparent text-[var(--color-brand-charcoal)] hover:bg-[rgba(15,23,42,0.04)]`;

const navActiveClass = `${navShellClass} app-shell-nav-item-active`;

const invoicesRouteActive = (pathname, navIsActive) =>
  Boolean(navIsActive || pathname.startsWith("/new/invoice"));

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

  const {
    loading: invoiceGateLoading,
    ready: canCreateInvoice,
  } = useInvoiceCreationReady();

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

  const drawer = (
    <aside className="flex h-full flex-col bg-white">
      <div className="flex min-h-[56px] items-center border-b border-[var(--color-border-soft)] px-4">
        <NavLink
          to="/dashboard"
          className="text-lg font-semibold tracking-[-0.02em] text-[var(--color-brand-charcoal)] no-underline"
        >
          Invoicer
        </NavLink>
      </div>
      <nav className="flex-1 px-1 pt-4" aria-label="основна навигация">
        <NavLink
          to="/dashboard"
          end
          onClick={closeDrawerIfMobile}
          className={({ isActive }) => (isActive ? navActiveClass : navInactiveClass)}
        >
          <DashboardOutlinedIcon fontSize="small" />
          <span>Табло</span>
        </NavLink>
        <NavLink
          to="/invoices"
          onClick={closeDrawerIfMobile}
          className={({ isActive }) =>
            invoicesRouteActive(pathname, isActive) ? navActiveClass : navInactiveClass
          }
        >
          <ReceiptLongOutlinedIcon fontSize="small" />
          <span>Фактури</span>
        </NavLink>
        <NavLink
          to="/products"
          end
          onClick={closeDrawerIfMobile}
          className={({ isActive }) => (isActive ? navActiveClass : navInactiveClass)}
        >
          <Inventory2OutlinedIcon fontSize="small" />
          <span>Продукти</span>
        </NavLink>
        <NavLink
          to="/customers"
          end
          onClick={closeDrawerIfMobile}
          className={({ isActive }) => (isActive ? navActiveClass : navInactiveClass)}
        >
          <PeopleOutlineOutlinedIcon fontSize="small" />
          <span>Клиенти</span>
        </NavLink>
        <button
          type="button"
          className={`${navInactiveClass} cursor-not-allowed opacity-55 hover:bg-transparent`}
          disabled
        >
          <AssessmentOutlinedIcon fontSize="small" />
          <span className="flex flex-col">
            <span>Отчети</span>
            <span className="text-[0.7rem] text-slate-500">Очаквайте скоро</span>
          </span>
        </button>
      </nav>
      <div className="border-t border-[rgba(15,23,42,0.12)] px-1 py-2">
        <NavLink
          to="/profile"
          end
          onClick={closeDrawerIfMobile}
          className={({ isActive }) => (isActive ? navActiveClass : navInactiveClass)}
        >
          <SettingsOutlinedIcon fontSize="small" />
          <span>Настройки на профила</span>
        </NavLink>
      </div>
      {userEmail ? (
        <div className="border-t border-[var(--color-border-soft)] px-4 pb-[calc(2rem+env(safe-area-inset-bottom,0px))] pt-4">
          <span className="block text-xs font-semibold text-slate-500">Вписан</span>
          <span
            className="block break-all text-[0.8125rem] leading-snug text-slate-500"
            title={userEmail}
          >
            {userEmail}
          </span>
        </div>
      ) : null}
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <div
        className="hidden w-[240px] shrink-0 border-r border-[var(--color-border-soft)] md:fixed md:inset-y-0 md:block"
        style={{ width: DRAWER_WIDTH }}
      >
        {drawer}
      </div>
      {isSmDown && mobileOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="затвори меню"
            className="absolute inset-0 bg-slate-900/35"
            onClick={handleDrawerToggle}
          />
          <div
            className="relative h-full border-r border-[var(--color-border-soft)]"
            style={{ width: DRAWER_WIDTH }}
          >
            {drawer}
          </div>
        </div>
      ) : null}

      <main className="flex min-w-0 flex-1 flex-col md:ml-[240px]">
        <header className="flex min-h-[56px] items-center gap-3 border-b border-[var(--color-border-soft)] bg-white px-4 sm:px-5">
          {isSmDown && (
            <button
              type="button"
              aria-label="отвори меню"
              onClick={handleDrawerToggle}
              className="inline-flex rounded-full p-2 text-[var(--color-brand-charcoal)] hover:bg-slate-100"
            >
              <MenuIcon />
            </button>
          )}
          <div className="flex-1" />
          {userEmail ? (
            <span
              className="mr-3 hidden max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap self-center text-[0.8125rem] leading-tight text-slate-500 sm:block md:mr-4 md:max-w-[280px]"
              title={userEmail}
            >
              {userEmail}
            </span>
          ) : null}
          <span
            title={
              invoiceGateLoading || canCreateInvoice
                ? ""
                : 'Добавете данъчни настройки (ДДС), фирмен идентификатор и банкови данни в "Профил", или включете "Не ми трябват банкови данни във фактурите".'
            }
          >
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<AddIcon />}
              disabled={invoiceGateLoading || !canCreateInvoice}
              onClick={() => navigate("/invoices/new")}
              sx={{
                minHeight: 40,
                px: 1.75,
                fontWeight: 600,
                textTransform: "none",
                boxShadow:
                  "0 2px 12px rgba(15, 118, 110, 0.12), 0 1px 4px rgba(15, 23, 42, 0.06)",
              }}
            >
              Нова фактура
            </Button>
          </span>
          <Button
            variant="text"
            color="inherit"
            size="small"
            startIcon={<LogoutOutlinedIcon sx={{ fontSize: 20 }} />}
            onClick={signOutUser}
            sx={{
              minHeight: 40,
              textTransform: "none",
              color: "var(--color-brand-charcoal)",
              "&:hover": {
                color: "var(--color-brand-primary)",
                bgcolor: "rgba(15, 118, 110, 0.06)",
              },
            }}
          >
            Изход
          </Button>
        </header>
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
