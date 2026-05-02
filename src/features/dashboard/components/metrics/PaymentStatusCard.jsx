import React from "react";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import { metricCardClass, metricIconClasses } from "../styles";

export function PaymentStatusCard({ paidCount, unpaidCount }) {
  return (
    <article className={metricCardClass}>
      <div className="flex items-start gap-4">
        <div className={metricIconClasses.mint}>
          <PaidOutlinedIcon sx={{ fontSize: 20 }} />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500">
            Платени / Неплатени
          </p>
          <p className="mt-1 text-xl font-bold text-slate-900">
            {paidCount} / {unpaidCount}
          </p>
          <p className="mt-1 block text-xs text-slate-500">
            По статус на плащане за месеца
          </p>
        </div>
      </div>
    </article>
  );
}
