import React from "react";
import { Button, InputAdornment, MenuItem, Stack, TextField } from "@mui/material";
import { setupProfileFieldProps } from "../../../../utils/muiFieldSx";
import { RowTotal } from "./RowTotal";

const fieldProps = setupProfileFieldProps;

export const ProductRowDiscountFields = ({
  showDiscountEditor,
  discountMode,
  discountInputValue,
  onDiscountModeChange,
  onDiscountValueChange,
  onAddDiscount,
  onDelete,
  rowTotal,
  currencySign,
  isEmpty,
  lineSx,
}) => {
  if (showDiscountEditor) {
    return (
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={0.75}
        sx={{ pt: 0 }}
      >
        <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ flex: 1, minWidth: 0 }}>
          <TextField
            {...fieldProps}
            select
            label="Тип"
            value={discountMode}
            onChange={onDiscountModeChange}
            sx={{ ...lineSx, width: { xs: "50%", sm: 170 }, flexShrink: 0 }}
          >
            <MenuItem value="percent">%</MenuItem>
            <MenuItem value="amount">{currencySign}</MenuItem>
          </TextField>
          <TextField
            {...fieldProps}
            type="number"
            label="Отстъпка"
            value={discountInputValue}
            onChange={onDiscountValueChange}
            inputProps={
              discountMode === "percent"
                ? { min: 0, max: 100, step: "0.1" }
                : { min: 0, step: "0.01" }
            }
            InputProps={
              discountMode === "amount"
                ? {
                    startAdornment: (
                      <InputAdornment position="start">{currencySign}</InputAdornment>
                    ),
                  }
                : undefined
            }
            sx={{
              ...lineSx,
              width: { xs: "50%", sm: 170 },
              flexShrink: 0,
              "& .MuiOutlinedInput-input": {
                ...(lineSx["& .MuiOutlinedInput-input"] || {}),
                textAlign: "right",
                fontVariantNumeric: "tabular-nums",
              },
            }}
          />
        </Stack>
        <RowTotal
          currencySign={currencySign}
          rowTotal={rowTotal}
          isEmpty={isEmpty}
          onDelete={onDelete}
        />
      </Stack>
    );
  }

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={0.5} sx={{ pt: 0 }}>
      <Button
        type="button"
        variant="text"
        size="small"
        sx={{ px: 0.5, minWidth: 0, fontWeight: 700 }}
        onClick={onAddDiscount}
      >
        + Отстъпка
      </Button>
      <RowTotal
        currencySign={currencySign}
        rowTotal={rowTotal}
        isEmpty={isEmpty}
        onDelete={onDelete}
      />
    </Stack>
  );
};
