import React from "react";
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import { FormFieldHelperText } from "../FormFieldHelperText";
import { setupProfileFieldProps } from "../../utils/muiFieldSx";
import { lineTotalWithVat } from "../../utils/invoiceLineNet";

const fieldProps = setupProfileFieldProps;
const COMMON_UNIT_OPTIONS = [
  "бр.",
  "кг",
  "г",
  "л",
  "мл",
  "м",
  "кв.м.",
  "куб.м.",
  "ч.",
  "ден",
  "мес.",
  "усл.",
  "пакет",
  "компл.",
];
const parseLocaleNumber = (value) => {
  const normalized = String(value ?? "")
    .trim()
    .replace(/\s+/g, "")
    .replace(",", ".");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : 0;
};

const invoiceLineFieldSx = (inlineCellSx) => ({
  ...inlineCellSx,
  mb: 0,
  width: "100%",
  minWidth: 0,
  "& .MuiOutlinedInput-root": {
    ...(inlineCellSx["& .MuiOutlinedInput-root"] || {}),
    maxWidth: "100%",
    height: "auto",
    minHeight: 40,
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(15, 23, 42, 0.14)",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(15, 23, 42, 0.2)",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "var(--color-brand-primary)",
      borderWidth: 1,
    },
    "&.Mui-error .MuiOutlinedInput-notchedOutline": {
      borderColor: "error.main",
      borderWidth: 2,
    },
    "&.Mui-error:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "error.main",
    },
    "&.Mui-error.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "error.main",
      borderWidth: 2,
    },
  },
  "& .MuiOutlinedInput-input": {
    ...(inlineCellSx["& .MuiOutlinedInput-input"] || {}),
    py: "8px",
    fontSize: "0.8125rem",
  },
  "& .MuiSelect-select": {
    ...(inlineCellSx["& .MuiSelect-select"] || {}),
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    pr: "30px !important",
    paddingTop: "8px !important",
    paddingBottom: "8px !important",
  },
  "& input[type=number]": {
    MozAppearance: "textfield",
  },
  "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
    {
      WebkitAppearance: "none",
      margin: 0,
    },
});

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
          продукти.
        </Typography>
      </Box>
    </Stack>
    {showRequiredError ? (
      <Typography variant="body2" color="error" sx={{ mb: 1, fontWeight: 600 }}>
        Добавете поне един продукт или услуга, за да издадете фактура.
      </Typography>
    ) : null}
    {!showVatField ? (
      <Stack
        direction="row"
        spacing={0.75}
        alignItems="center"
        sx={{ mb: 1, color: "text.disabled" }}
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
    ) : null}
    <Stack direction="row" justifyContent="flex-end" sx={{ mb: 0.75 }}>
      <Button
        type="button"
        variant="contained"
        size="small"
        onClick={addRow}
        sx={{
          minHeight: 30,
          px: 1.5,
          py: 0.25,
          borderRadius: 1.5,
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
        const rowTotal = lineTotalWithVat(
          showVatField ? row : { ...row, itemVatRate: 0 },
          showVatField ? defaultBusinessVatRate : 0,
        );
        const isEmpty = !isMeaningfulRow(row);
        const lineSx = invoiceLineFieldSx(inlineCellSx);
        const discountPercent = Number(
          row.itemDiscountPercent ?? row.itemDiscount ?? 0,
        );
        const discountAmount = Number(row.itemDiscountAmount ?? 0);
        const hasDiscountValue = discountPercent > 0 || discountAmount > 0;
        const discountMode =
          row.itemDiscountMode === "amount" || discountAmount > 0
            ? "amount"
            : "percent";
        const showDiscountEditor =
          Boolean(row.itemDiscountMode) || hasDiscountValue;
        const discountInputValue =
          discountMode === "percent"
            ? Number(row.itemDiscountPercent ?? row.itemDiscount ?? 0) > 0
              ? (row.itemDiscountPercent ?? row.itemDiscount)
              : ""
            : Number(row.itemDiscountAmount ?? 0) > 0
              ? row.itemDiscountAmount
              : "";
        return (
          <Box
            key={row._rowId}
            sx={{
              px: { xs: 1, sm: 1.25 },
              py: 0.9,
              borderTop:
                idx === 0 ? "none" : "1px solid rgba(15, 23, 42, 0.06)",
              bgcolor: "#fff",
            }}
          >
            <Stack spacing={0.75}>
              <Grid
                container
                spacing={1}
                alignItems="flex-start"
                columns={{ xs: 12, sm: 12, md: 100 }}
              >
                <Grid item xs={12} md={40}>
                  <Autocomplete
                    freeSolo
                    forcePopupIcon
                    popupIcon={<ExpandMoreIcon fontSize="small" />}
                    options={products}
                    value={row.itemName || ""}
                    inputValue={row.itemName || ""}
                    getOptionLabel={(option) =>
                      typeof option === "string" ? option : option?.name || ""
                    }
                    onInputChange={(_, value, reason) => {
                      if (reason === "input" || reason === "clear") {
                        updateRow(row._rowId, "itemName", value);
                      }
                    }}
                    onChange={(_, selected) => {
                      if (!selected) return;
                      if (typeof selected === "string") {
                        updateRow(row._rowId, "itemName", selected);
                        return;
                      }
                      const pickedName = String(selected.name || "").trim();
                      const pickedPrice = Number(selected.price);
                      const pickedVat = Number(selected.vat);
                      const nextPatch = {
                        itemName: pickedName,
                        itemCost: Number.isFinite(pickedPrice)
                          ? pickedPrice
                          : row.itemCost,
                        itemUnit: selected.unit || row.itemUnit || "бр.",
                        itemVatRate: Number.isFinite(pickedVat)
                          ? pickedVat
                          : Number(row.itemVatRate || 0),
                      };
                      if (!(Number(row.itemQuantity) > 0)) {
                        nextPatch.itemQuantity = 1;
                      }
                      patchRow(row._rowId, nextPatch);
                    }}
                    sx={lineSx}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        {...fieldProps}
                        label="Име на услуга/стока"
                        placeholder="Напр. Дизайн на мобилно приложение"
                        required
                        error={Boolean(resolveFieldError("itemName"))}
                        helperText={
                          <FormFieldHelperText
                            errorMessage={resolveFieldError("itemName")}
                          />
                        }
                        FormHelperTextProps={{ component: "div" }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6} sm={3} md={15} sx={{ minWidth: { md: 88 } }}>
                  <TextField
                    {...fieldProps}
                    type="number"
                    label="Количество"
                    required
                    placeholder="1"
                    value={row.itemQuantity}
                    onChange={(e) =>
                      updateRow(row._rowId, "itemQuantity", e.target.value)
                    }
                    inputProps={{ min: 0, step: "0.01" }}
                    error={Boolean(resolveFieldError("itemQuantity"))}
                    helperText={
                      <FormFieldHelperText
                        errorMessage={resolveFieldError("itemQuantity")}
                      />
                    }
                    FormHelperTextProps={{ component: "div" }}
                    sx={{
                      ...lineSx,
                      "& .MuiOutlinedInput-input": {
                        ...(lineSx["& .MuiOutlinedInput-input"] || {}),
                        textAlign: "right",
                        fontVariantNumeric: "tabular-nums",
                      },
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6} sm={3} md={15} sx={{ minWidth: { md: 88 } }}>
                  <Autocomplete
                    freeSolo
                    options={COMMON_UNIT_OPTIONS}
                    value={String(row.itemUnit || "").trim() || "бр."}
                    onChange={(_, value) =>
                      updateRow(
                        row._rowId,
                        "itemUnit",
                        String(value || "").trim() || "бр.",
                      )
                    }
                    onInputChange={(_, value, reason) => {
                      if (reason === "input" || reason === "clear") {
                        updateRow(
                          row._rowId,
                          "itemUnit",
                          String(value || "").trim(),
                        );
                      }
                    }}
                    sx={lineSx}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        {...fieldProps}
                        label="Единица"
                        required
                        placeholder="бр."
                        error={Boolean(resolveFieldError("itemUnit"))}
                        helperText={
                          <FormFieldHelperText
                            errorMessage={resolveFieldError("itemUnit")}
                          />
                        }
                        FormHelperTextProps={{ component: "div" }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6} sm={3} md={15} sx={{ minWidth: { md: 88 } }}>
                  <TextField
                    {...fieldProps}
                    type="number"
                    label="Ед. цена"
                    required
                    placeholder="0.00"
                    value={row.itemCost}
                    onChange={(e) =>
                      updateRow(row._rowId, "itemCost", e.target.value)
                    }
                    inputProps={{ step: "0.01", min: 0 }}
                    error={Boolean(resolveFieldError("itemCost"))}
                    helperText={
                      <FormFieldHelperText
                        errorMessage={resolveFieldError("itemCost")}
                      />
                    }
                    FormHelperTextProps={{ component: "div" }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {currencySign}
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      ...lineSx,
                      "& .MuiOutlinedInput-input": {
                        ...(lineSx["& .MuiOutlinedInput-input"] || {}),
                        textAlign: "right",
                        fontVariantNumeric: "tabular-nums",
                      },
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6} sm={3} md={15} sx={{ minWidth: { md: 88 } }}>
                  {showVatField ? (
                    <TextField
                      {...fieldProps}
                      select
                      label="ДДС %"
                      required
                      value={row.itemVatRate}
                      onChange={(e) =>
                        updateRow(
                          row._rowId,
                          "itemVatRate",
                          Number(e.target.value),
                        )
                      }
                      sx={lineSx}
                      error={Boolean(resolveFieldError("itemVatRate"))}
                      helperText={
                        <FormFieldHelperText
                          errorMessage={resolveFieldError("itemVatRate")}
                        />
                      }
                      FormHelperTextProps={{ component: "div" }}
                      fullWidth
                    >
                      {vatRateOptions.map((rate) => (
                        <MenuItem key={rate} value={rate}>
                          {rate}%
                        </MenuItem>
                      ))}
                    </TextField>
                  ) : (
                    <Box sx={{ minHeight: 40 }} />
                  )}
                </Grid>
              </Grid>

              {showDiscountEditor ? (
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={0.75}
                  sx={{ pt: 0 }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="flex-start"
                    sx={{ flex: 1, minWidth: 0 }}
                  >
                    <TextField
                      {...fieldProps}
                      type="number"
                      label="Отстъпка"
                      value={discountInputValue}
                      onChange={(e) => {
                        if (e.target.value === "") {
                          patchRow(row._rowId, {
                            itemDiscountPercent: 0,
                            itemDiscountAmount: 0,
                            itemDiscount: 0,
                          });
                          return;
                        }
                        const v = Number(e.target.value);
                        const safe = Number.isFinite(v) ? v : 0;
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
                      }}
                      inputProps={
                        discountMode === "percent"
                          ? { min: 0, max: 100, step: "0.1" }
                          : { min: 0, step: "0.01" }
                      }
                      InputProps={
                        discountMode === "amount"
                          ? {
                              startAdornment: (
                                <InputAdornment position="start">
                                  {currencySign}
                                </InputAdornment>
                              ),
                            }
                          : undefined
                      }
                      sx={{
                        ...lineSx,
                        maxWidth: { xs: "100%", sm: 280 },
                        "& .MuiOutlinedInput-input": {
                          ...(lineSx["& .MuiOutlinedInput-input"] || {}),
                          textAlign: "right",
                          fontVariantNumeric: "tabular-nums",
                        },
                      }}
                      fullWidth
                    />
                    <TextField
                      {...fieldProps}
                      select
                      label="Тип"
                      value={discountMode}
                      onChange={(e) => {
                        const mode =
                          e.target.value === "amount" ? "amount" : "percent";
                        if (mode === "percent") {
                          patchRow(row._rowId, {
                            itemDiscountMode: "percent",
                            itemDiscountPercent: Number(
                              row.itemDiscountPercent || 0,
                            ),
                            itemDiscount: Number(row.itemDiscountPercent || 0),
                            itemDiscountAmount: 0,
                          });
                        } else {
                          patchRow(row._rowId, {
                            itemDiscountMode: "amount",
                            itemDiscountAmount: Number(
                              row.itemDiscountAmount || 0,
                            ),
                            itemDiscountPercent: 0,
                            itemDiscount: 0,
                          });
                        }
                      }}
                      sx={{ ...lineSx, width: 104, flexShrink: 0 }}
                    >
                      <MenuItem value="percent">%</MenuItem>
                      <MenuItem value="amount">{currencySign}</MenuItem>
                    </TextField>
                  </Stack>
                  <Box
                    sx={{
                      minWidth: { xs: 120, md: 140 },
                      maxWidth: { xs: 170, md: 190 },
                      width: "100%",
                      minHeight: 24,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      gap: 0.5,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        flex: 1,
                        textAlign: "right",
                        whiteSpace: "nowrap",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        fontWeight: 600,
                        fontSize: "0.8125rem",
                        lineHeight: 1,
                        fontVariantNumeric: "tabular-nums",
                        color: isEmpty ? "text.disabled" : "text.primary",
                      }}
                    >
                      {currencySign} {rowTotal.toFixed(2)}
                    </Typography>
                    <IconButton
                      size="small"
                      color={isEmpty ? "default" : "error"}
                      aria-label="Изтрий ред"
                      disabled={isEmpty}
                      onClick={(e) => deleteRow(e, row._rowId)}
                      sx={{
                        flexShrink: 0,
                        p: 0.25,
                        alignSelf: "center",
                      }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Stack>
              ) : (
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={0.5}
                  sx={{ pt: 0 }}
                >
                  <Button
                    type="button"
                    variant="text"
                    size="small"
                    sx={{ px: 0.5, minWidth: 0, fontWeight: 700 }}
                    onClick={() =>
                      patchRow(row._rowId, {
                        itemDiscountMode: "percent",
                        itemDiscountPercent: 0,
                        itemDiscountAmount: 0,
                        itemDiscount: 0,
                      })
                    }
                  >
                    + Отстъпка
                  </Button>
                  <Box
                    sx={{
                      minWidth: { xs: 120, md: 140 },
                      maxWidth: { xs: 170, md: 190 },
                      width: "100%",
                      minHeight: 24,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      gap: 0.5,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        flex: 1,
                        textAlign: "right",
                        whiteSpace: "nowrap",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        fontWeight: 600,
                        fontSize: "0.8125rem",
                        lineHeight: 1,
                        fontVariantNumeric: "tabular-nums",
                        color: isEmpty ? "text.disabled" : "text.primary",
                      }}
                    >
                      {currencySign} {rowTotal.toFixed(2)}
                    </Typography>
                    <IconButton
                      size="small"
                      color={isEmpty ? "default" : "error"}
                      aria-label="Изтрий ред"
                      disabled={isEmpty}
                      onClick={(e) => deleteRow(e, row._rowId)}
                      sx={{
                        flexShrink: 0,
                        p: 0.25,
                        alignSelf: "center",
                      }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Stack>
              )}
            </Stack>
          </Box>
        );
      })}
    </Box>
  </Paper>
);
