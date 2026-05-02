import React from "react";

const variantClasses = {
  card: "rounded-2xl border border-[var(--color-border-soft)] bg-white shadow-sm",
  subtle: "rounded-2xl border border-slate-200/70 bg-slate-50/80",
  plain: "",
};

export const Section = ({
  as: Component = "section",
  variant = "card",
  className = "",
  children,
  ...props
}) => (
  <Component className={`${variantClasses[variant] || variantClasses.card} ${className}`.trim()} {...props}>
    {children}
  </Component>
);
