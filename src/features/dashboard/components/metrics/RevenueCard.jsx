import React from "react";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import {
  metricCaptionClass,
  metricCardClass,
  metricIconClasses,
  metricLabelClass,
} from "../styles";

export function RevenueCard({ isVatRegistered, revenueLabel, revenueNetLabel }) {
  const iconTone = isVatRegistered ? "blue" : "green";

  return (
    <article className={metricCardClass}>
      <div className="flex items-center gap-4">
        <div className={metricIconClasses[iconTone]}>
          <TrendingUpOutlinedIcon sx={{ fontSize: 22 }} />
        </div>
        <div className="min-w-0 flex-1">
          <p className={metricLabelClass}>Общо фактурирано</p>
          <p className="mt-1 text-xl font-bold tabular-nums text-slate-900">
            {revenueLabel}
          </p>
          {isVatRegistered && revenueNetLabel ? (
            <p className="mt-1 text-sm tabular-nums text-[var(--color-text-muted)]">
              ({revenueNetLabel} без ДДС)
            </p>
          ) : null}
          <p className={metricCaptionClass}>За текущия месец</p>
        </div>
      </div>
    </article>
  );
}
