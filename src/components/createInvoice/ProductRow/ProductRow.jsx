import React from "react";
import { Box, Grid, Stack } from "@mui/material";
import { lineTotalWithVat } from "../../../utils/invoiceLineNet";
import { invoiceLineFieldSx, COMMON_UNIT_OPTIONS } from "./styles";
import { ProductNameField } from "./fields/ProductNameField";
import { QuantityField } from "./fields/QuantityField";
import { UnitField } from "./fields/UnitField";
import { PriceField } from "./fields/PriceField";
import { VatField } from "./fields/VatField";
import { DiscountEditor } from "./DiscountEditor";

export const ProductRow = ({
  row,
  idx,
  products,
  currencySign,
  showVatField,
  defaultBusinessVatRate,
  inlineCellSx,
  vatRateOptions,
  isMeaningfulRow,
  updateRow,
  patchRow,
  deleteRow,
  resolveFieldError,
}) => {
  const rowTotal = lineTotalWithVat(
    showVatField ? row : { ...row, itemVatRate: 0 },
    showVatField ? defaultBusinessVatRate : 0,
  );
  const isEmpty = !isMeaningfulRow(row);
  const lineSx = invoiceLineFieldSx(inlineCellSx);
  const onDelete = (e) => deleteRow(e, row._rowId);

  return (
    <Box
      sx={{
        px: { xs: 1, sm: 1.25 },
        pt: { xs: 0.9, md: 1.5 },
        pb: { xs: 0.9, md: 0.9 },
        borderTop: idx === 0 ? "none" : "1px solid rgba(15, 23, 42, 0.06)",
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
            <ProductNameField
              row={row}
              products={products}
              lineSx={lineSx}
              updateRow={updateRow}
              patchRow={patchRow}
              error={resolveFieldError("itemName")}
            />
          </Grid>
          <Grid item xs={6} sm={3} md={15} sx={{ minWidth: { md: 88 } }}>
            <QuantityField
              row={row}
              lineSx={lineSx}
              updateRow={updateRow}
              error={resolveFieldError("itemQuantity")}
            />
          </Grid>
          <Grid item xs={6} sm={3} md={15} sx={{ minWidth: { md: 88 } }}>
            <UnitField
              row={row}
              lineSx={lineSx}
              unitOptions={COMMON_UNIT_OPTIONS}
              updateRow={updateRow}
              error={resolveFieldError("itemUnit")}
            />
          </Grid>
          <Grid item xs={6} sm={3} md={15} sx={{ minWidth: { md: 88 } }}>
            <PriceField
              row={row}
              lineSx={lineSx}
              currencySign={currencySign}
              updateRow={updateRow}
              error={resolveFieldError("itemCost")}
            />
          </Grid>
          <Grid item xs={6} sm={3} md={15} sx={{ minWidth: { md: 88 } }}>
            <VatField
              row={row}
              lineSx={lineSx}
              showVatField={showVatField}
              vatRateOptions={vatRateOptions}
              updateRow={updateRow}
              error={resolveFieldError("itemVatRate")}
            />
          </Grid>
        </Grid>

        <DiscountEditor
          row={row}
          patchRow={patchRow}
          rowTotal={rowTotal}
          currencySign={currencySign}
          isEmpty={isEmpty}
          onDelete={onDelete}
          lineSx={lineSx}
        />
      </Stack>
    </Box>
  );
};
