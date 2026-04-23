import React from "react";
import { Box, Button, InputAdornment, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ProductButton from "../ProductButton";
import { setupProfileFieldProps } from "../../utils/muiFieldSx";

const fieldProps = setupProfileFieldProps;

export const ProductsSection = ({
  sectionShellSx,
  sectionIconBoxSx,
  inlineCellSx,
  products,
  currencySign,
  handleAddToRow,
  itemList,
  isMeaningfulRow,
  updateRow,
  vatRateOptions,
  deleteRow,
  showRequiredError = false,
}) => (
  <Paper
    variant="outlined"
    sx={{
      ...sectionShellSx,
      borderColor: showRequiredError ? "error.main" : sectionShellSx.borderColor,
      boxShadow: showRequiredError ? "0 0 0 2px rgba(211, 47, 47, 0.12)" : "none",
    }}
  >
    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
      <Box sx={sectionIconBoxSx}>
        <Inventory2OutlinedIcon fontSize="small" />
      </Box>
      <Box>
        <Typography
          sx={{
            fontWeight: 700,
            color: showRequiredError ? "error.main" : "var(--color-brand-primary)",
          }}
        >
          Продукти
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          Добавяйте по един ред с артикул. Задължително е поне един продукт/услуга.
        </Typography>
      </Box>
    </Stack>
    {showRequiredError ? (
      <Typography
        variant="body2"
        color="error"
        sx={{ mb: 1, fontWeight: 600 }}
      >
        Добавете поне един продукт или услуга, за да издадете фактура.
      </Typography>
    ) : null}

    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, minmax(0, 1fr))",
          lg: "repeat(4, minmax(0, 1fr))",
        },
        gap: 1,
        mb: 2,
      }}
    >
      {products.map((product) => (
        <ProductButton
          key={product.id}
          id={product.id}
          name={product.name}
          price={product.price}
          currencySymbol={currencySign}
          click={handleAddToRow}
        />
      ))}
    </Box>

    <Box sx={{ border: "1px solid rgba(15, 23, 42, 0.08)", borderRadius: 2, overflow: "hidden" }}>
      <Box
        sx={{
          display: { xs: "none", md: "grid" },
          gridTemplateColumns: "5fr 2fr 2fr 2fr 1.6fr 56px",
          px: 1.25,
          py: 1,
          bgcolor: "rgba(15, 23, 42, 0.04)",
          borderBottom: "1px solid rgba(15, 23, 42, 0.08)",
        }}
      >
        {[
          { label: "Артикул", align: "left" },
          { label: "Ед. цена", align: "right" },
          { label: "ДДС %", align: "right" },
          { label: "Количество", align: "right" },
          { label: "Общо", align: "right" },
        ].map((h) => (
          <Typography
            key={h.label}
            variant="caption"
            sx={{
              color: "#64748b",
              fontWeight: 700,
              fontSize: "0.73rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              textAlign: h.align,
              ...(h.align === "right" ? { pr: 1.5 } : {}),
            }}
          >
            {h.label}
          </Typography>
        ))}
        <Typography
          variant="caption"
          sx={{
            color: "#64748b",
            fontWeight: 700,
            fontSize: "0.73rem",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          Изтрий
        </Typography>
      </Box>

      {itemList.map((row, idx) => {
        const rowTotal =
          (Number(row.itemCost) || 0) *
          (Number(row.itemQuantity) || 0) *
          (1 + (Number(row.itemVatRate) || 0) / 100);
        const isEmpty = !isMeaningfulRow(row);
        return (
          <Box
            key={row._rowId}
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "5fr 2fr 2fr 2fr 1.6fr 56px",
              },
              gap: 1,
              alignItems: "center",
              px: 1.25,
              py: 0.75,
              borderTop: idx === 0 ? "none" : "1px solid rgba(15, 23, 42, 0.06)",
            }}
          >
            <TextField
              {...fieldProps}
              placeholder="Име на артикул"
              value={row.itemName}
              onChange={(e) => updateRow(row._rowId, "itemName", e.target.value)}
              sx={{ ...inlineCellSx, mb: 0 }}
            />
            <TextField
              {...fieldProps}
              type="number"
              placeholder="0.00"
              value={row.itemCost}
              onChange={(e) => updateRow(row._rowId, "itemCost", e.target.value)}
              inputProps={{ step: "0.01", min: 0 }}
              InputProps={{
                startAdornment: <InputAdornment position="start">{currencySign}</InputAdornment>,
              }}
              sx={{
                ...inlineCellSx,
                mb: 0,
                "& .MuiOutlinedInput-input": {
                  py: "10px",
                  textAlign: "right",
                  fontVariantNumeric: "tabular-nums",
                },
              }}
            />
            <TextField
              {...fieldProps}
              select
              value={row.itemVatRate}
              onChange={(e) => updateRow(row._rowId, "itemVatRate", Number(e.target.value))}
              sx={{ ...inlineCellSx, mb: 0 }}
            >
              {vatRateOptions.map((rate) => (
                <MenuItem key={rate} value={rate}>
                  {rate}%
                </MenuItem>
              ))}
            </TextField>
            <TextField
              {...fieldProps}
              type="number"
              placeholder="Кол."
              value={row.itemQuantity}
              onChange={(e) => updateRow(row._rowId, "itemQuantity", e.target.value)}
              inputProps={{ min: 1 }}
              sx={{
                ...inlineCellSx,
                mb: 0,
                "& .MuiOutlinedInput-input": {
                  py: "10px",
                  textAlign: "right",
                  fontVariantNumeric: "tabular-nums",
                },
              }}
            />
            <Typography
              variant="body1"
              sx={{
                pr: 1,
                textAlign: "right",
                fontWeight: 700,
                whiteSpace: "nowrap",
                color: isEmpty ? "text.disabled" : "text.primary",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {currencySign} {rowTotal.toFixed(2)}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              {!isEmpty ? (
                <Button
                  type="button"
                  size="small"
                  color="error"
                  onClick={(e) => deleteRow(e, row._rowId)}
                  sx={{ minWidth: 32, px: 0.5 }}
                >
                  X
                </Button>
              ) : (
                <Box sx={{ width: 32 }} />
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  </Paper>
);

