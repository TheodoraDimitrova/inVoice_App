import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const SetupProfileAccordion = ({
  panelId,
  openPanels,
  setOpenPanels,
  panelHasError,
  icon,
  title,
  description,
  first = false,
  children,
}) => {
  const isOpen = Boolean(openPanels[panelId]);
  return (
  <section className={first ? "" : "border-t border-[rgba(15,23,42,0.08)]"}>
    <button
      type="button"
      aria-expanded={isOpen}
      aria-controls={`setup-${panelId}-content`}
      id={`setup-${panelId}-header`}
      className="flex w-full items-start justify-between gap-4 rounded-xl px-2 py-4 text-left opacity-95 transition-colors hover:bg-white/50"
      onClick={() => setOpenPanels((prev) => ({ ...prev, [panelId]: !isOpen }))}
    >
      <div className="flex items-start gap-4">
        <div className="section-icon-tile">{icon}</div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={`text-[1.05rem] ${
                openPanels[panelId]
                  ? "font-extrabold text-[var(--color-brand-primary)]"
                  : "font-bold text-slate-700"
              }`}
            >
              {title}
            </h3>
            {panelHasError(panelId) ? (
              <span className="inline-flex h-[22px] items-center rounded-full border border-red-300 px-2 text-xs font-medium text-red-600">
                Поправка
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>
        </div>
      </div>
      <ExpandMoreIcon
        className={`mt-2 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
      />
    </button>
    {isOpen ? (
      <div id={`setup-${panelId}-content`} className="px-2 pb-4 sm:px-4">
        {children}
      </div>
    ) : null}
  </section>
  );
};

export default SetupProfileAccordion;
