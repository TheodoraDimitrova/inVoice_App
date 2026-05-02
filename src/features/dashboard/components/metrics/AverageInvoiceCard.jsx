import React from "react";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import { metricCardClass, metricIconClasses } from "../styles";

export function AverageInvoiceCard({ averageInvoiceLabel }) {
  return (
    <article className={metricCardClass}>
      <div className="flex items-start gap-4">
        <div className={metricIconClasses.amber}>
          <ScheduleOutlinedIcon sx={{ fontSize: 20 }} />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500">
            Средна стойност
          </p>
          <p className="mt-1 text-xl font-bold text-slate-900">
            {averageInvoiceLabel}
          </p>
          <p className="mt-1 block text-xs text-slate-500">
            Средна стойност на фактура за месеца
          </p>
        </div>
      </div>
    </article>
  );
}
