import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-200 bg-white/90">
      <div className="page-shell py-4 md:py-8 flex flex-col items-center  md:text-left md:flex-row md:items-center justify-between gap-4 w-full">
        <p className="text-sm text-slate-600 ">
          &copy; {new Date().getFullYear()} Invoicer
        </p>

        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm md:justify-end">
          <Link to="/" className="brand-link">
            Поверителност
          </Link>
          <Link to="/" className="brand-link">
            Условия
          </Link>
          <Link to="/" className="brand-link">
            Контакт
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
