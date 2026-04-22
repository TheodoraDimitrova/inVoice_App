import React from "react";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";

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

const userTypes = [
  {
    type: "Registered companies",
    value:
      "Full VAT support, including compliant VAT handling and automatic company ID validation.",
    icon: ApartmentOutlinedIcon,
  },
  {
    type: "Freelancers",
    value:
      "Simple invoice creation with company/trade identifiers only, ideal for self-employed professionals.",
    icon: PaletteOutlinedIcon,
    badge: "Issue invoices with BULSTAT in seconds.",
  },
  {
    type: "Digital nomads",
    value:
      "Support for international banking details (IBAN/SWIFT), including providers like Revolut and Wise.",
    icon: PublicOutlinedIcon,
    badge: "Get paid via Wise, Revolut, and Payoneer.",
  },
  {
    type: "Small businesses",
    value:
      "Flexible invoicing for bank transfers or cash payments, including a no-bank-details workflow.",
    icon: StorefrontOutlinedIcon,
  },
];

const valuePoints = [
  "Full compliance by design: company/trade ID and VAT number validation aligned with EU invoicing expectations.",
  "Flexible payment workflows: issue invoices for bank transfer or cash payments in one flow.",
  "Built for cross-border business: international address and banking formats are supported out of the box.",
  "Automated tax handling: configure VAT rates (0%, 9%, 20%) and let calculations run automatically.",
];

const FeaturesSection = () => {
  return (
    <section id="features" className="page-shell pt-12 md:pt-14 pb-14 md:pb-16">
      <div className="mb-8 text-center">
        <h2 className="text-[1.55rem] md:text-[1.95rem] font-semibold text-slate-900 tracking-[-0.01em]">
          Who can use Invoicer?
        </h2>
        <p className="text-slate-600 mt-3 max-w-3xl mx-auto text-sm sm:text-base">
          Invoicer is designed for modern teams and independent professionals
          who need compliant, practical invoicing.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5 md:gap-7">
        {userTypes.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.type} className="feature-card flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-brand-accent)] flex items-center justify-center shrink-0">
                  <Icon sx={{ color: "var(--color-brand-primary)" }} />
                </div>
                <h3 className="text-lg font-medium text-slate-900">
                  {item.type}
                </h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                {item.value}
              </p>
              {item.badge ? (
                <div className="mt-3">
                  <span className="inline-flex items-center rounded-full border border-[var(--color-brand-primary)]/30 bg-[var(--color-brand-accent)] px-3 py-1 text-xs sm:text-[0.8rem] font-medium text-[var(--color-brand-primary)]">
                    {item.badge}
                  </span>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>

      <div className="mt-14 md:mt-16 mb-10 md:mb-12 text-center">
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
            <article key={feature.title} className="feature-card flex flex-col">
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

      <div className="mt-10 md:mt-12">
        <div className="feature-card border-l-4 border-l-[var(--color-brand-primary)] py-5 px-5 md:px-6">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900">
            Built on regulatory trust
          </h3>

          <p className="text-slate-700 text-sm sm:text-[0.95rem] leading-relaxed mt-2">
            Smart validation for 40+ business identifiers. From EIK to SIREN and
            NIF, we ensure your invoices stay compliant across the EU.
          </p>
        </div>
      </div>

      <div className="mt-14 md:mt-16">
        <h2 className="text-[1.55rem] md:text-[1.95rem] font-semibold text-slate-900 tracking-[-0.01em] text-center">
          Everything your business needs in one tool
        </h2>
        <div className="mt-6 grid gap-3">
          {valuePoints.map((point) => (
            <div
              key={point}
              className="feature-card flex items-start gap-3 py-4 px-4 md:px-5"
            >
              <TaskAltOutlinedIcon
                sx={{
                  color: "var(--color-brand-primary)",
                  fontSize: 21,
                  mt: "1px",
                  flexShrink: 0,
                }}
              />
              <p className="text-slate-700 text-sm sm:text-[0.95rem] leading-relaxed">
                {point}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
