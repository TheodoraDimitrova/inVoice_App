import React from "react";
import { Link } from "react-router-dom";
import invoice from "../images/invoice.png";

const Hero = () => {
  return (
    <section className="page-shell py-9 md:py-14 flex lg:flex-row items-center justify-between flex-col gap-10 md:gap-12">
      <div className="w-full lg:w-3/5 text-center lg:text-left">
        <h1 className="text-[2rem] sm:text-[2.35rem] md:text-5xl font-semibold mb-4 sm:mb-5 md:mb-6 leading-[1.08] text-[var(--color-brand-charcoal)]">
          Create a professional invoice in under 60 seconds.
        </h1>
        <p className="text-slate-600 mb-8 md:mb-12 text-[0.98rem] md:text-[1.12rem] leading-relaxed max-w-[34rem] mx-auto lg:mx-0">
          Built for freelancers and small businesses - generate PDF invoices,
          manage VAT, and keep your client database in one place.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start max-w-md mx-auto lg:mx-0">
          <Link to="/login" className="w-full sm:w-auto">
            <button className="btn-brand rounded w-full sm:w-[220px] px-4 py-3 font-semibold">
              Get Started Free
            </button>
          </Link>
          <a
            href="#features"
            className="btn-brand-outline rounded w-full sm:w-[220px] px-4 py-3 font-semibold text-center inline-flex items-center justify-center"
          >
            View Sample Invoice
          </a>
        </div>
      </div>

      <div className="w-full lg:w-2/5 flex items-center justify-center">
        <img
          src={invoice}
          alt="Invoice app preview"
          className="w-[85%] sm:w-[72%] lg:w-full max-w-md"
        />
      </div>
    </section>
  );
};

export default Hero;
