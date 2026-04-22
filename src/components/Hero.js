import React from "react";
import { Link } from "react-router-dom";
import * as Flags from "country-flag-icons/react/3x2";
import { COUNTRIES } from "../data/countries";
import { getCountryCommercialDefaults } from "../data/countryCommercialRules";
import invoice from "../images/invoice.png";

const supportedIso2 = COUNTRIES.map((country) => getCountryCommercialDefaults(country).iso2)
  .filter(Boolean);

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
        <p className="text-slate-700 mb-8 md:mb-10 text-sm md:text-base leading-relaxed max-w-[36rem] mx-auto lg:mx-0 font-medium">
          No complex accounting suites. Validated company ID and VAT data.
          Designed for Bulgaria and the EU.
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

        <div className="mt-6 md:mt-7 max-w-[38rem] mx-auto lg:mx-0">
          <p className="text-[0.8rem] sm:text-[0.85rem] text-slate-400 mb-2.5">
            Supporting businesses across <strong>27 EU nations</strong> & more.
          </p>
          <div className="flex flex-wrap gap-2.5 justify-center lg:justify-start">
            {supportedIso2.map((iso2) => {
              const Flag = Flags[iso2];
              if (!Flag) return null;
              return (
                <span
                  key={iso2}
                  className="w-9 h-6 rounded-[4px] overflow-hidden border border-slate-200 shadow-sm grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition duration-200"
                  title={iso2}
                >
                  <Flag
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </span>
              );
            })}
          </div>
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
