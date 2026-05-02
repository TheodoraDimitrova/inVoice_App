import React from "react";
import { DRAWER_WIDTH } from "./Sidebar";

export const MobileDrawer = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <button
        type="button"
        aria-label="затвори меню"
        className="absolute inset-0 bg-slate-900/35"
        onClick={onClose}
      />
      <div
        className="relative h-full border-r border-[var(--color-border-soft)]"
        style={{ width: DRAWER_WIDTH }}
      >
        {children}
      </div>
    </div>
  );
};
