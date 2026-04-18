import React from "react";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import CreditCardOffOutlinedIcon from "@mui/icons-material/CreditCardOffOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";

const trustItems = [
  { icon: BoltOutlinedIcon, label: "Free" },
  { icon: CreditCardOffOutlinedIcon, label: "No credit card required" },
  { icon: ShieldOutlinedIcon, label: "GDPR-ready" },
  { icon: PictureAsPdfOutlinedIcon, label: "PDF export" },
];

const TrustBar = () => {
  return (
    <section className="page-shell py-7 md:py-8">
      <div className="trust-bar-surface rounded-xl border border-slate-200/90 bg-slate-50/90 px-4 py-5 md:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
        {trustItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="flex items-center gap-2.5 text-slate-700 justify-center sm:justify-start lg:justify-center w-full min-h-[32px]"
            >
              <span
                className="inline-flex shrink-0 items-center justify-center w-[22px] h-[22px]"
                aria-hidden
              >
                <Icon
                  sx={{
                    fontSize: 20,
                    color: "var(--color-brand-primary)",
                    display: "block",
                  }}
                />
              </span>
              <span className="text-sm font-medium leading-snug">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TrustBar;
