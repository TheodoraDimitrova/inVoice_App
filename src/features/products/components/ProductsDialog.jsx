import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import {
  ProductNameField,
  PriceField,
  QuantityField,
  UnitField,
  COMMON_UNIT_OPTIONS,
  productRowFieldSx,
} from "../../../components/product-row-fields";

const ProductsDialog = ({
  open,
  saving,
  editing,
  sortedProducts,
  formErrors,
  formRow,
  onClose,
  onSubmit,
  updateRow,
  patchRow,
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth="md"
    fullWidth
    scroll="paper"
    PaperProps={{
      sx: {
        borderRadius: 2.5,
        overflow: "hidden",
        bgcolor: "#f8fafc",
        border: "1px solid rgba(15,23,42,0.08)",
        boxShadow: "0 16px 44px rgba(2,6,23,0.18)",
      },
    }}
  >
    <DialogTitle
      sx={{
        pb: 1.5,
        pt: 2,
        px: { xs: 2, sm: 3 },
        fontWeight: 700,
        bgcolor: "#fff",
        borderBottom: "1px solid rgba(15,23,42,0.08)",
      }}
    >
      {editing ? "Редакция на продукт" : "Добавяне на продукт"}
    </DialogTitle>
    <Box component="form" onSubmit={onSubmit} noValidate>
      <DialogContent sx={{ pt: 2.5, px: { xs: 2, sm: 3 }, pb: 2.5, overflowX: "hidden", bgcolor: "#f8fafc" }}>
        <Grid container spacing={2.25}>
          {formErrors._form ? (
            <Grid item xs={12}>
              <Typography variant="body2" color="error">
                {formErrors._form}
              </Typography>
            </Grid>
          ) : null}
          <Grid item xs={12}>
            <ProductNameField
              row={formRow}
              products={sortedProducts}
              lineSx={productRowFieldSx}
              updateRow={updateRow}
              patchRow={patchRow}
              error={formErrors.name}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <QuantityField row={formRow} lineSx={productRowFieldSx} updateRow={updateRow} error={formErrors.itemQuantity} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <UnitField row={formRow} lineSx={productRowFieldSx} unitOptions={COMMON_UNIT_OPTIONS} updateRow={updateRow} error={formErrors.itemUnit} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <PriceField row={formRow} lineSx={productRowFieldSx} currencySign="EUR" updateRow={updateRow} error={formErrors.priceNet} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: 2, bgcolor: "#fff", borderTop: "1px solid rgba(15,23,42,0.08)" }}>
        <Button onClick={onClose} disabled={saving}>
          Отказ
        </Button>
        <Button type="submit" variant="contained" disabled={saving}>
          {editing ? "Запази промените" : "Добави продукт"}
        </Button>
      </DialogActions>
    </Box>
  </Dialog>
);

export default ProductsDialog;
