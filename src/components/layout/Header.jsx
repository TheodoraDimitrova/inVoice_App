import React from "react";
import { Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

export const Header = ({
  showMenuButton,
  onMenuClick,
  userEmail,
  invoiceGateLoading,
  canCreateInvoice,
  onNewInvoice,
  onSignOut,
}) => (
  <header className="flex min-h-[56px] items-center gap-3 border-b border-[var(--color-border-soft)] bg-white px-4 sm:px-5">
    {showMenuButton ? (
      <button
        type="button"
        aria-label="отвори меню"
        onClick={onMenuClick}
        className="inline-flex rounded-full p-2 text-[var(--color-brand-charcoal)] hover:bg-slate-100"
      >
        <MenuIcon />
      </button>
    ) : null}
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
        onClick={onNewInvoice}
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
      onClick={onSignOut}
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
);
