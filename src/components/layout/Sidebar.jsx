import React from "react";
import { NavLink } from "react-router-dom";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

export const DRAWER_WIDTH = 240;

const navBase =
  "mx-2 mb-1 flex w-[calc(100%-1rem)] items-center gap-3 rounded-2xl border-0 px-3 py-2 text-[0.9375rem] font-[inherit] no-underline outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)] focus-visible:ring-offset-2";

const getNavLinkClass = (active) =>
  active
    ? `${navBase} bg-[#0f766e] font-semibold text-white shadow-md shadow-[#0f766e]/20`
    : `${navBase} bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900`;

const invoicesRouteActive = (pathname, navIsActive) =>
  Boolean(
    navIsActive ||
    pathname.startsWith("/new/invoice") ||
    pathname.startsWith("/invoices/new"),
  );

const navInactiveDisabled = `${navBase} cursor-not-allowed bg-transparent text-slate-600 opacity-55 hover:bg-transparent hover:text-slate-600`;

const navItems = [
  {
    to: "/dashboard",
    label: "Табло",
    icon: <DashboardOutlinedIcon fontSize="small" />,
    end: true,
  },
  {
    to: "/invoices",
    label: "Фактури",
    icon: <ReceiptLongOutlinedIcon fontSize="small" />,
    resolveActive: (pathname, isActive) =>
      invoicesRouteActive(pathname, isActive),
  },
  {
    to: "/products",
    label: "Продукти",
    icon: <Inventory2OutlinedIcon fontSize="small" />,
    end: true,
  },
  {
    to: "/customers",
    label: "Клиенти",
    icon: <PeopleOutlineOutlinedIcon fontSize="small" />,
    end: true,
  },
];

export const Sidebar = ({ pathname, userEmail, onNavClick }) => (
  <aside className="flex h-full flex-col bg-white">
    <div className="flex min-h-[56px] items-center border-b border-slate-200 px-4">
      <NavLink
        to="/dashboard"
        className="text-lg font-semibold tracking-[-0.02em] text-slate-800 no-underline"
      >
        Factura BG
      </NavLink>
    </div>
    <nav className="flex-1 px-1 pt-4" aria-label="основна навигация">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={Boolean(item.end)}
          onClick={onNavClick}
          className={({ isActive }) =>
            getNavLinkClass(
              item.resolveActive
                ? item.resolveActive(pathname, isActive)
                : isActive,
            )
          }
        >
          {item.icon}
          <span>{item.label}</span>
        </NavLink>
      ))}
      <button type="button" className={navInactiveDisabled} disabled>
        <AssessmentOutlinedIcon fontSize="small" />
        <span className="flex flex-col text-left">
          <span>Отчети</span>
          <span className="text-[0.7rem] text-slate-500">Очаквайте скоро</span>
        </span>
      </button>
    </nav>
    <div className="border-t border-[rgba(15,23,42,0.12)] px-1 py-2">
      <NavLink
        to="/profile"
        end
        onClick={onNavClick}
        className={({ isActive }) => getNavLinkClass(isActive)}
      >
        <SettingsOutlinedIcon fontSize="small" />
        <span>Настройки на профила</span>
      </NavLink>
    </div>
    {userEmail ? (
      <div className="border-t border-slate-200 px-4 pb-[calc(2rem+env(safe-area-inset-bottom,0px))] pt-4">
        <span className="block text-xs font-semibold text-slate-500">
          Вписан
        </span>
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
