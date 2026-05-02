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
    title: "Създаване на фактури",
    description:
      "Създавайте професионални фактури за минути със смислени настройки по подразбиране и изчистен дизайн.",
    icon: ReceiptLongOutlinedIcon,
  },
  {
    title: "Управление на клиенти",
    description:
      "Поддържайте цялата си клиентска база на едно място и намалете повтарящото се въвеждане.",
    icon: GroupsOutlinedIcon,
  },
  {
    title: "Проследяване на плащания",
    description:
      "Следете изпратените фактури и получените плащания, за да имате ясен паричен поток.",
    icon: InsightsOutlinedIcon,
  },
];

const userTypes = [
  {
    type: "Регистрирани фирми",
    value:
      "Пълна ДДС поддръжка, включително съобразена обработка и автоматична валидация на фирмени идентификатори.",
    icon: ApartmentOutlinedIcon,
  },
  {
    type: "Фрийлансъри",
    value:
      "Лесно създаване на фактури само с фирмен/търговски идентификатор – идеално за самоосигуряващи се.",
    icon: PaletteOutlinedIcon,
    badge: "Издавайте фактури с Булстат за секунди.",
  },
  {
    type: "Дигитални номади",
    value:
      "Поддръжка на международни банкови данни (IBAN/SWIFT), включително доставчици като Revolut и Wise.",
    icon: PublicOutlinedIcon,
    badge: "Получавайте плащания чрез Wise, Revolut и Payoneer.",
  },
  {
    type: "Малък бизнес",
    value:
      "Гъвкаво фактуриране за банкови преводи или плащане в брой, включително сценарий без банкови данни.",
    icon: StorefrontOutlinedIcon,
  },
];

const valuePoints = [
  "Пълно съответствие по дизайн: валидация на фирмен/търговски идентификатор и ДДС номер според българската практика.",
  "Гъвкав процес на плащане: издавайте фактури за банков превод или плащане в брой в един и същ поток.",
  "Поддръжка на реални бизнес казуси: формати за адреси и банкови данни, използвани в практиката.",
  "Без грешки в сметките: Автоматично изчисляване на ДДС (20%, 9%, 0%) според българското законодателство",
];

const FeaturesSection = () => {
  return (
    <section id="features" className="page-shell pt-12 md:pt-14 pb-14 md:pb-16">
      <div className="mb-8 text-center">
        <h2 className="text-[1.55rem] md:text-[1.95rem] font-semibold text-slate-900 tracking-[-0.01em]">
          Кой може да използва Invoicer?
        </h2>
        <p className="text-slate-600 mt-3 max-w-3xl mx-auto text-sm sm:text-base">
          Invoicer е създаден за модерни екипи и независими професионалисти,
          които имат нужда от практично и съобразено фактуриране.
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
          Всичко необходимо за фактуриране
        </h2>
        <p className="text-slate-600 mt-4 md:mt-5 max-w-2xl mx-auto text-sm sm:text-base">
          Инструменти, които спестяват време и представят бизнеса ви
          професионално пред всеки клиент.
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
            Създадено с регулаторно доверие
          </h3>

          <p className="text-slate-700 text-sm sm:text-[0.95rem] leading-relaxed mt-2">
            Умна валидация на български бизнес идентификатори. От ЕИК до
            Булстат, помагаме фактурите ви да са съобразени за България.
          </p>
        </div>
      </div>

      <div className="mt-14 md:mt-16">
        <h2 className="text-[1.55rem] md:text-[1.95rem] font-semibold text-slate-900 tracking-[-0.01em] text-center">
          Всичко, от което бизнесът ви има нужда, в един инструмент
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
