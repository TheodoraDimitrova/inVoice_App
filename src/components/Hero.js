import React from "react";
import { Link } from "react-router-dom";
import { BG } from "country-flag-icons/react/3x2";
import invoice from "../images/invoice.png";



const Hero = () => {
  return (
    <section className="page-shell py-9 md:py-14 flex lg:flex-row items-center justify-between flex-col gap-10 md:gap-12">
      <div className="w-full lg:w-3/5 text-center lg:text-left">
        <h1 className="text-[2rem] sm:text-[2.35rem] md:text-5xl font-semibold mb-4 sm:mb-5 md:mb-6 leading-[1.08] text-[var(--color-brand-charcoal)]">
          Създай професионална фактура за под 60 секунди.
        </h1>
        <p className="text-slate-600 mb-8 md:mb-12 text-[0.98rem] md:text-[1.12rem] leading-relaxed max-w-[34rem] mx-auto lg:mx-0">
          Създадено за фрийлансъри и малък бизнес – издавайте PDF фактури,
          управлявайте ДДС и поддържайте клиентите си на едно място.
        </p>
        <p className="text-slate-700 mb-8 md:mb-10 text-sm md:text-base leading-relaxed max-w-[36rem] mx-auto lg:mx-0 font-medium">
          Без сложни счетоводни системи. Валидирани фирмени идентификатори и
          ДДС данни. Създадено за България{" "}
          <span className="inline-flex align-middle ml-1 w-6 h-4 rounded-[2px] overflow-hidden border border-slate-200">
            <BG
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </span>
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start max-w-md mx-auto lg:mx-0">
          <Link to="/login" className="w-full sm:w-auto">
            <button className="btn-brand rounded w-full sm:w-[220px] px-4 py-3 font-semibold">
              Започни безплатно
            </button>
          </Link>
          <a
            href="#features"
            className="btn-brand-outline rounded w-full sm:w-[220px] px-4 py-3 font-semibold text-center inline-flex items-center justify-center"
          >
            Виж примерна фактура
          </a>
        </div>

   
      </div>

      <div className="w-full lg:w-2/5 flex items-center justify-center">
        <img
          src={invoice}
          alt="Преглед на приложението за фактуриране"
          className="w-[85%] sm:w-[72%] lg:w-full max-w-md"
        />
      </div>
    </section>
  );
};

export default Hero;
