import React from "react";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";

const features = [
  {
    title: "Create invoices",
    description:
      "Create professional invoices in minutes with smart defaults and a clean layout.",
    icon: ReceiptLongOutlinedIcon,
  },
  {
    title: "Manage clients",
    description:
      "Keep your entire client database in one place and reduce repetitive data entry.",
    icon: GroupsOutlinedIcon,
  },
  {
    title: "Track payments",
    description:
      "Monitor sent invoices and received payments so your cash flow is always clear.",
    icon: InsightsOutlinedIcon,
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="page-shell pt-12 md:pt-14 pb-14 md:pb-16">
      <div className="mb-10 md:mb-12 text-center">
        <h2 className="text-[1.75rem] md:text-3xl font-semibold text-slate-900 tracking-[-0.01em]">
          Everything you need for invoicing
        </h2>
        <p className="text-slate-600 mt-4 md:mt-5 max-w-2xl mx-auto text-sm sm:text-base">
          Tools that save time and help you present your business professionally
          to every client.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <article
              key={feature.title}
              className="feature-card flex flex-col"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-brand-accent)] flex items-center justify-center shrink-0">
                  <Icon sx={{ color: "var(--color-brand-primary)" }} />
                </div>
                <h3 className="text-lg font-medium text-slate-900">
                  {feature.title}
                </h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-2">
                {feature.description}
              </p>

              <div className="mt-auto" />
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturesSection;
