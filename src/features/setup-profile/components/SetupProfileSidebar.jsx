import React from "react";

const SetupProfileSidebar = () => (
  <aside className="rounded-3xl border border-[var(--color-border-soft)] bg-[rgba(15,118,110,0.04)] p-6 shadow-sm lg:sticky lg:top-6">
    <h2 className="mb-4 text-sm font-bold text-slate-900">
      Съвети
    </h2>
    <p className="mb-4 text-sm leading-relaxed text-slate-500">
      <strong>Задължителни данни:</strong>
      <br />
      Фирма, адрес и <strong>ЕИК / BULSTAT</strong>.
      <br />
      ДДС номер се изисква само ако сте регистрирани по ДДС.
    </p>
    <p className="mb-4 text-sm leading-relaxed text-slate-500">
      <strong>По избор:</strong>
      <br />
      Телефон, лого и банкови данни.
    </p>
    <p className="mb-4 text-sm leading-relaxed text-slate-500">
      <strong>Банкови данни:</strong>
      <br />
      Ако ги добавите, попълнете име на банка, IBAN и SWIFT/BIC. Можете да
      изберете опцията без банкови данни.
    </p>
    <p className="mb-4 text-sm leading-relaxed text-slate-500">
      <strong>Фактури:</strong>
      <br />
      След попълване на основните данни ще можете да създавате фактури.
    </p>
    <p className="block text-xs leading-relaxed text-slate-500">
      <strong>Съвет:</strong>
      <br />
      Печат и подпис не са задължителни – фактурата е валидна и без тях.
    </p>
  </aside>
);

export default SetupProfileSidebar;
