import React from "react";

const sizeClasses = {
  xs: "max-w-xs",

  confirm: "max-w-md",
  sm: "max-w-lg",
  md: "max-w-3xl",
  lg: "max-w-5xl",
};

export const Modal = ({
  open,
  onClose,
  title,
  leading,
  size = "sm",
  children,
  footer,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Затвори"
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px]"
        onClick={onClose}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl ${sizeClasses[size] || sizeClasses.sm}`}
      >
        {title ? (
          <header className="shrink-0 border-b border-slate-200 px-5 py-3">
            {leading ? (
              <div className="flex items-center gap-2">
                <div className="shrink-0">{leading}</div>
                <h2 className="min-w-0 text-lg font-bold leading-snug text-slate-900">
                  {title}
                </h2>
              </div>
            ) : (
              <h2 className="text-lg font-bold text-slate-900">{title}</h2>
            )}
          </header>
        ) : null}
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </div>
        {footer ? (
          <footer className="flex shrink-0 flex-wrap justify-end gap-1.5 border-t border-slate-200 bg-slate-50 px-5 py-3.5 pb-4">
            {footer}
          </footer>
        ) : null}
      </section>
    </div>
  );
};
