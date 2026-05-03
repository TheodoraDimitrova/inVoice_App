import React from "react";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import {
  metricCaptionClass,
  metricCardClass,
  metricIconClasses,
  metricLabelClass,
} from "../styles";

export function AverageInvoiceCard({ averageInvoiceLabel }) {
  return (
    <article className={metricCardClass}>
      <div className="flex items-center gap-4">
        <div className={metricIconClasses.amber}>
          <ScheduleOutlinedIcon sx={{ fontSize: 22 }} />
        </div>
        <div className="min-w-0 flex-1">
          <p className={metricLabelClass}>Средна стойност</p>
          <p className="mt-1 text-xl font-bold text-slate-900">
            {averageInvoiceLabel}
          </p>
          <p className={metricCaptionClass}>
            Средна стойност на фактура за месеца
          </p>
        </div>
      </div>
    </article>
  );
}
