import React from "react";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import {
  metricCaptionClass,
  metricCardClass,
  metricIconClasses,
  metricLabelClass,
} from "../styles";

export function InvoicesCard({ issuedCount }) {
  return (
    <article className={metricCardClass}>
      <div className="flex items-center gap-4">
        <div className={metricIconClasses.blue}>
          <DescriptionOutlinedIcon sx={{ fontSize: 22 }} />
        </div>
        <div className="min-w-0 flex-1">
          <p className={metricLabelClass}>Издадени фактури</p>
          <p className="mt-1 text-xl font-bold text-slate-900">
            {issuedCount}
          </p>
          <p className={metricCaptionClass}>Брой за текущия месец</p>
        </div>
      </div>
    </article>
  );
}
