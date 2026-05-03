import React from "react";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import { metricCardClass, metricIconClasses } from "../styles";

export function RevenueCard({ isVatRegistered, revenueLabel, revenueNetLabel }) {
  const iconTone = isVatRegistered ? "blue" : "green";

  return (
    <article className={metricCardClass}>
      <div className="flex items-start gap-4">
        <div className={metricIconClasses[iconTone]}>
          <TrendingUpOutlinedIcon sx={{ fontSize: 20 }} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-500">
            Общо фактурирано
          </p>
          <p className="mt-1 text-xl font-bold tabular-nums text-slate-900">
            {revenueLabel}
          </p>
          {isVatRegistered && revenueNetLabel ? (
            <p className="mt-1 text-sm tabular-nums text-slate-600">
              ({revenueNetLabel} без ДДС)
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
