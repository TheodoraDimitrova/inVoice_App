import React from "react";
import { Autocomplete, TextField } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { setupProfileFieldProps } from "../../utils/muiFieldSx";
import { FormFieldHelperText } from "../FormFieldHelperText";

const fieldProps = setupProfileFieldProps;
const NO_PRODUCTS_OPTION = "Нямате запазени продукти";

export const ProductNameField = ({
  row,
  products,
  lineSx,
  updateRow,
  patchRow,
  error,
}) => {
  const hasCatalogProducts = Array.isArray(products) && products.length > 0;
  const productOptions = hasCatalogProducts ? products : [NO_PRODUCTS_OPTION];

  return (
    <Autocomplete
      freeSolo
      forcePopupIcon
      popupIcon={<ExpandMoreIcon fontSize="small" />}
      options={productOptions}
      noOptionsText="Няма съвпадащи продукти"
      getOptionDisabled={(option) =>
        typeof option === "string" && option === NO_PRODUCTS_OPTION
      }
      value={row.name || ""}
      inputValue={row.name || ""}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option?.name || ""
      }
      onInputChange={(_, value, reason) => {
        if (reason === "input" || reason === "clear") {
          updateRow(row._rowId, "name", value);
        }
      }}
      onChange={(_, selected) => {
        if (!selected) return;
        if (typeof selected === "string") {
          if (selected === NO_PRODUCTS_OPTION) return;
          updateRow(row._rowId, "name", selected);
          return;
        }
        const pickedPrice = Number(selected.price);
        const pickedQuantity = Number(selected.quantityDefault);
        const nextPatch = {
          name: String(selected.name || "").trim(),
          priceNet: Number.isFinite(pickedPrice) ? pickedPrice : row.priceNet,
          itemUnit: selected.unit || row.itemUnit || "бр.",
        };
        if (!(Number(row.itemQuantity) > 0)) {
          nextPatch.itemQuantity =
            Number.isFinite(pickedQuantity) && pickedQuantity >= 1
              ? pickedQuantity
              : 1;
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
          error={Boolean(error)}
          helperText={<FormFieldHelperText errorMessage={error} />}
          FormHelperTextProps={{ component: "div" }}
        />
      )}
    />
  );
};
