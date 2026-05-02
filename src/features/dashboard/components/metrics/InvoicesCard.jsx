import React from "react";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { metricCardClass, metricIconClasses } from "../styles";

export function InvoicesCard({ issuedCount }) {
  return (
    <article className={metricCardClass}>
      <div className="flex items-start gap-4">
        <div className={metricIconClasses.blue}>
          <DescriptionOutlinedIcon sx={{ fontSize: 20 }} />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500">
            Издадени фактури
          </p>
          <p className="mt-1 text-xl font-bold text-slate-900">
            {issuedCount}
          </p>
          <p className="mt-1 block text-xs text-slate-500">
            Брой за текущия месец
          </p>
        </div>
      </div>
    </article>
  );
}
