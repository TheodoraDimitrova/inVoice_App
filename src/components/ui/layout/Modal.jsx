import React from "react";

const sizeClasses = {
  xs: "max-w-xs",
  sm: "max-w-lg",
  md: "max-w-3xl",
  lg: "max-w-5xl",
};

export const Modal = ({ open, onClose, title, size = "sm", children, footer }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Затвори"
        className="absolute inset-0 bg-slate-900/40"
        onClick={onClose}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative max-h-[90vh] w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl ${sizeClasses[size] || sizeClasses.sm}`}
      >
        {title ? (
          <header className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          </header>
        ) : null}
        <div className="max-h-[calc(90vh-8rem)] overflow-auto">{children}</div>
        {footer ? (
          <footer className="flex flex-wrap justify-end gap-2 border-t border-slate-200 bg-white px-5 py-4">
            {footer}
          </footer>
        ) : null}
      </section>
    </div>
  );
};
