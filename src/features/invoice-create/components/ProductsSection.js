import React from "react";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
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

export const ProductsSection = ({
  sectionShellSx,
  sectionIconBoxSx,
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
}) => (
  <Paper
    variant="outlined"
    sx={{
      ...sectionShellSx,
      px: { xs: 1, sm: 1.25 },
      py: { xs: 1.25, sm: 1.5 },
      borderColor: sectionShellSx.borderColor,
      boxShadow: "none",
    }}
  >
    <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 1 }}>
      <Box sx={sectionIconBoxSx}>
        <Inventory2OutlinedIcon fontSize="small" />
      </Box>
      <Box>
        <Typography
          sx={{
            fontWeight: 700,
            color: showRequiredError
              ? "error.main"
              : "var(--color-brand-primary)",
          }}
        >
          Продукти
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          Задължителен е поне един артикул. Полето за име предлага записаните
          продукти и услуги.
        </Typography>
      </Box>
    </Stack>
    {showRequiredError ? (
      <Typography variant="body2" color="error" sx={{ mb: 1, fontWeight: 600 }}>
        Добавете поне един продукт или услуга, за да издадете фактура.
      </Typography>
    ) : null}
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ mb: 0.75 }}
    >
      {!showVatField ? (
        <Stack
          direction="row"
          spacing={0.75}
          alignItems="center"
          sx={{ color: "text.disabled" }}
        >
          <InfoOutlinedIcon sx={{ fontSize: 16, color: "text.disabled" }} />
          <Typography
            variant="body2"
            sx={{ color: "text.disabled", fontWeight: 500 }}
          >
            Фирмата не е регистрирана по ДДС, затова артикулите се добавят без
            данък
          </Typography>
        </Stack>
      ) : (
        <Box />
      )}
      <Button
        type="button"
        onClick={addRow}
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
    </Stack>

    <Box
      sx={{
        border: "1px solid rgba(15, 23, 42, 0.08)",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
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
    </Box>
  </Paper>
);
