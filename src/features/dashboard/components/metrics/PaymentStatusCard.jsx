import React from "react";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import {
  metricCaptionClass,
  metricCardClass,
  metricIconClasses,
  metricLabelClass,
} from "../styles";

export function PaymentStatusCard({ paidCount, unpaidCount }) {
  return (
    <article className={metricCardClass}>
      <div className="flex items-center gap-4">
        <div className={metricIconClasses.mint}>
          <PaidOutlinedIcon sx={{ fontSize: 22 }} />
        </div>
        <div className="min-w-0 flex-1">
          <p className={metricLabelClass}>Платени / Неплатени</p>
          <p className="mt-1 text-xl font-bold text-slate-900">
            {paidCount} / {unpaidCount}
          </p>
          <p className={metricCaptionClass}>По статус на плащане за месеца</p>
        </div>
      </div>
    </article>
  );
}
