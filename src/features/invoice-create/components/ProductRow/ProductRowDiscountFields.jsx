import React from "react";
import { Button, InputAdornment, MenuItem, TextField } from "@mui/material";
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
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-2">
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
        </div>
        <RowTotal
          currencySign={currencySign}
          rowTotal={rowTotal}
          isEmpty={isEmpty}
          onDelete={onDelete}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-2">
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
    </div>
  );
};
