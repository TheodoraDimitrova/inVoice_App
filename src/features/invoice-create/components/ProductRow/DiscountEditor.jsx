import React from "react";
import { ProductRowDiscountFields } from "./ProductRowDiscountFields";

const parseLocaleNumber = (value) => {
  const normalized = String(value ?? "")
    .trim()
    .replace(/\s+/g, "")
    .replace(",", ".");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : 0;
};

export const DiscountEditor = ({
  row,
  patchRow,
  rowTotal,
  currencySign,
  isEmpty,
  onDelete,
  lineSx,
}) => {
  const discountPercent = Number(row.itemDiscountPercent ?? row.itemDiscount ?? 0);
  const discountAmount = Number(row.itemDiscountAmount ?? 0);
  const hasDiscountValue = discountPercent > 0 || discountAmount > 0;
  const discountMode =
    row.itemDiscountMode === "amount" || discountAmount > 0
      ? "amount"
      : "percent";
  const showDiscountEditor = Boolean(row.itemDiscountMode) || hasDiscountValue;
  const discountInputValue =
    discountMode === "percent"
      ? Number(row.itemDiscountPercent ?? row.itemDiscount ?? 0) > 0
        ? (row.itemDiscountPercent ?? row.itemDiscount)
        : ""
      : Number(row.itemDiscountAmount ?? 0) > 0
        ? row.itemDiscountAmount
        : "";

  const onDiscountModeChange = (e) => {
    const mode = e.target.value === "amount" ? "amount" : "percent";
    if (mode === "percent") {
      patchRow(row._rowId, {
        itemDiscountMode: "percent",
        itemDiscountPercent: Number(row.itemDiscountPercent || 0),
        itemDiscount: Number(row.itemDiscountPercent || 0),
        itemDiscountAmount: 0,
      });
    } else {
      patchRow(row._rowId, {
        itemDiscountMode: "amount",
        itemDiscountAmount: Number(row.itemDiscountAmount || 0),
        itemDiscountPercent: 0,
        itemDiscount: 0,
      });
    }
  };

  const onDiscountValueChange = (e) => {
    if (e.target.value === "") {
      patchRow(row._rowId, {
        itemDiscountPercent: 0,
        itemDiscountAmount: 0,
        itemDiscount: 0,
      });
      return;
    }
    const safe = parseLocaleNumber(e.target.value);
    if (discountMode === "percent") {
      patchRow(row._rowId, {
        itemDiscountMode: "percent",
        itemDiscountPercent: safe,
        itemDiscount: safe,
        itemDiscountAmount: 0,
      });
    } else {
      patchRow(row._rowId, {
        itemDiscountMode: "amount",
        itemDiscountAmount: safe,
        itemDiscountPercent: 0,
        itemDiscount: 0,
      });
    }
  };

  const onAddDiscount = () =>
    patchRow(row._rowId, {
      itemDiscountMode: "percent",
      itemDiscountPercent: 0,
      itemDiscountAmount: 0,
      itemDiscount: 0,
    });

  return (
    <ProductRowDiscountFields
      showDiscountEditor={showDiscountEditor}
      discountMode={discountMode}
      discountInputValue={discountInputValue}
      onDiscountModeChange={onDiscountModeChange}
      onDiscountValueChange={onDiscountValueChange}
      onAddDiscount={onAddDiscount}
      onDelete={onDelete}
      rowTotal={rowTotal}
      currencySign={currencySign}
      isEmpty={isEmpty}
      lineSx={lineSx}
    />
  );
};
