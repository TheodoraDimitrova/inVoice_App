import React from "react";

const sizeClasses = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  app: "max-w-[var(--page-max-width)]",
};

export const Container = ({
  as: Component = "div",
  size = "app",
  className = "",
  children,
  ...props
}) => (
  <Component
    className={`mx-auto w-full px-4 md:px-8 ${sizeClasses[size] || sizeClasses.app} ${className}`.trim()}
    {...props}
  >
    {children}
  </Component>
);
