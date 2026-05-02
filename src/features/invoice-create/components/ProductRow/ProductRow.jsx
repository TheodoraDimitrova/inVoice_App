import React from "react";
import { lineTotalWithVat } from "../../../../utils/invoiceLineNet";
import { invoiceLineFieldSx, COMMON_UNIT_OPTIONS } from "./styles";
import { ProductNameField } from "./fields/ProductNameField";
import { QuantityField } from "./fields/QuantityField";
import { UnitField } from "./fields/UnitField";
import { PriceField } from "../../../../components/product-row-fields";
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
    <div
      className={`bg-white px-4 py-4 md:pt-6 ${
        idx === 0 ? "" : "border-t border-[rgba(15,23,42,0.06)]"
      }`}
    >
      <div className="space-y-3">
        <div className="grid grid-cols-12 items-start gap-2">
          <div className="col-span-12 md:col-span-5">
            <ProductNameField
              row={row}
              products={products}
              lineSx={lineSx}
              updateRow={updateRow}
              patchRow={patchRow}
              error={resolveFieldError("itemName")}
            />
          </div>
          <div className="col-span-6 min-w-0 sm:col-span-3 md:col-span-2 md:min-w-[88px]">
            <QuantityField
              row={row}
              lineSx={lineSx}
              updateRow={updateRow}
              error={resolveFieldError("itemQuantity")}
            />
          </div>
          <div className="col-span-6 min-w-0 sm:col-span-3 md:col-span-2 md:min-w-[88px]">
            <UnitField
              row={row}
              lineSx={lineSx}
              unitOptions={COMMON_UNIT_OPTIONS}
              updateRow={updateRow}
              error={resolveFieldError("itemUnit")}
            />
          </div>
          <div className="col-span-6 min-w-0 sm:col-span-3 md:col-span-2 md:min-w-[88px]">
            <PriceField
              row={row}
              lineSx={lineSx}
              currencySign={currencySign}
              updateRow={updateRow}
              error={resolveFieldError("itemCost")}
              fieldName="itemCost"
            />
          </div>
          <div className="col-span-6 min-w-0 sm:col-span-3 md:col-span-1 md:min-w-[88px]">
            <VatField
              row={row}
              lineSx={lineSx}
              showVatField={showVatField}
              vatRateOptions={vatRateOptions}
              updateRow={updateRow}
              error={resolveFieldError("itemVatRate")}
            />
          </div>
        </div>

        <DiscountEditor
          row={row}
          patchRow={patchRow}
          rowTotal={rowTotal}
          currencySign={currencySign}
          isEmpty={isEmpty}
          onDelete={onDelete}
          lineSx={lineSx}
        />
      </div>
    </div>
  );
};
