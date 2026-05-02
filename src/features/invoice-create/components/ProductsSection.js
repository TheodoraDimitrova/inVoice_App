import React from "react";
import { Button } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import { ProductRow } from "./ProductRow/ProductRow";

const parseLocaleNumber = (value) => {
  const normalized = String(value ?? "")
    .trim()
    .replace(/\s+/g, "")
    .replace(",", ".");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : 0;
};

const isRowComplete = (row) => {
  const name = String(row?.itemName || "").trim();
  const unit = String(row?.itemUnit || "").trim();
  const cost = parseLocaleNumber(row?.itemCost);
  const qty = parseLocaleNumber(row?.itemQuantity);
  return name !== "" && unit !== "" && cost > 0 && qty >= 1;
};

const sectionClass =
  "rounded-2xl border border-[rgba(15,23,42,0.08)] bg-[rgba(15,23,42,0.04)] px-4 py-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:px-5 sm:py-6";
export const ProductsSection = ({
  inlineCellSx,
  products,
  currencySign,
  itemList,
  isMeaningfulRow,
  updateRow,
  patchRow,
  addRow,
  vatRateOptions,
  showVatField = true,
  deleteRow,
  itemErrors = [],
  showRequiredError = false,
  defaultBusinessVatRate = 20,
}) => {
  const lastRow = itemList[itemList.length - 1];
  const canAddRow = !lastRow || isRowComplete(lastRow);

  return (
  <section className={sectionClass}>
    <div className="mb-4 flex items-center gap-3">
      <div className="section-icon-tile">
        <Inventory2OutlinedIcon fontSize="inherit" />
      </div>
      <div>
        <h2
          className={`font-bold ${
            showRequiredError ? "text-red-600" : "text-[var(--color-brand-primary)]"
          }`}
        >
          Продукти
        </h2>
        <p className="text-xs text-slate-500">
          Задължителен е поне един артикул. Полето за име предлага записаните
          продукти и услуги.
        </p>
      </div>
    </div>
    {showRequiredError ? (
      <p className="mb-4 text-sm font-semibold text-red-600">
        Добавете поне един продукт или услуга, за да издадете фактура.
      </p>
    ) : null}
    <div className="mb-3 flex items-center justify-between gap-3">
      {!showVatField ? (
        <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
          <InfoOutlinedIcon sx={{ fontSize: 16 }} />
          <p>
            Фирмата не е регистрирана по ДДС, затова артикулите се добавят без
            данък
          </p>
        </div>
      ) : (
        <div />
      )}
      <span title={canAddRow ? "" : "Попълнете текущия ред, преди да добавите нов"}>
        <Button
          type="button"
          onClick={addRow}
          disabled={!canAddRow}
          sx={{
            minHeight: 30,
            px: 1.5,
            py: 0.25,
            textTransform: "none",
            fontWeight: 700,
            fontSize: "0.8rem",
            lineHeight: 1.1,
            color: "primary.contrastText",
            bgcolor: "primary.main",
            boxShadow: "none",
            "&:hover": {
              bgcolor: "primary.dark",
              boxShadow: "none",
            },
          }}
        >
          + Нов ред
        </Button>
      </span>
    </div>

    <div className="overflow-hidden rounded-2xl border border-[rgba(15,23,42,0.08)]">
      {itemList.map((row, idx) => {
        const rowErrors =
          (Array.isArray(itemErrors) ? itemErrors[idx] : itemErrors?.[idx]) ||
          {};
        const hasAtLeastOneValidRow = itemList.some((r) => {
          const name = String(r?.itemName || "").trim();
          const unit = String(r?.itemUnit || "").trim();
          const cost = parseLocaleNumber(r?.itemCost);
          const qty = parseLocaleNumber(r?.itemQuantity);
          return name !== "" && unit !== "" && cost > 0 && qty >= 1;
        });
        const rowHasInput =
          String(row?.itemName || "").trim() !== "" ||
          String(row?.itemUnit || "").trim() !== "" ||
          parseLocaleNumber(row?.itemCost) > 0 ||
          parseLocaleNumber(row?.itemQuantity) > 0;
        const shouldShowFallbackForRow =
          showRequiredError &&
          (rowHasInput || (!hasAtLeastOneValidRow && idx === 0));
        const fallbackRowErrors = shouldShowFallbackForRow
          ? {
              itemName: String(row?.itemName || "").trim()
                ? null
                : "Името е задължително.",
              itemUnit: String(row?.itemUnit || "").trim()
                ? null
                : "Единицата е задължителна.",
              itemCost:
                parseLocaleNumber(row?.itemCost) > 0
                  ? null
                  : "Ед. цена е задължителна.",
              itemQuantity:
                parseLocaleNumber(row?.itemQuantity) >= 1
                  ? null
                  : "Количеството трябва да е >= 1.",
              itemVatRate:
                showVatField && !(parseLocaleNumber(row?.itemVatRate) >= 0)
                  ? "ДДС е задължително."
                  : null,
            }
          : {};
        const resolveFieldError = (field) =>
          rowErrors?.[field]?.message || fallbackRowErrors?.[field] || "";
        return (
          <ProductRow
            key={row._rowId}
            row={row}
            idx={idx}
            products={products}
            currencySign={currencySign}
            showVatField={showVatField}
            defaultBusinessVatRate={defaultBusinessVatRate}
            inlineCellSx={inlineCellSx}
            vatRateOptions={vatRateOptions}
            isMeaningfulRow={isMeaningfulRow}
            updateRow={updateRow}
            patchRow={patchRow}
            deleteRow={deleteRow}
            resolveFieldError={resolveFieldError}
          />
        );
      })}
    </div>
  </section>
  );
};
