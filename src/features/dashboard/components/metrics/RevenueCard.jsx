import React from "react";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import { metricCardClass, metricIconClasses } from "../styles";

export function RevenueCard({ revenueLabel }) {
  return (
    <article className={metricCardClass}>
      <div className="flex items-start gap-4">
        <div className={metricIconClasses.green}>
          <TrendingUpOutlinedIcon sx={{ fontSize: 20 }} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-500">
            Общ приход (месец)
          </p>
          <p className="mt-1 text-xl font-bold text-slate-900">
            {revenueLabel}
          </p>
          <p className="mt-1 block text-xs text-slate-500">
            Сбор от издадени фактури за текущия месец
          </p>
        </div>
      </div>
    </article>
  );
}
