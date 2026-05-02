import React from "react";
import {
  Button,
} from "@mui/material";
import {
  ProductNameField,
  PriceField,
  QuantityField,
  UnitField,
  COMMON_UNIT_OPTIONS,
  productRowFieldSx,
} from "../../../components/product-row-fields";
import { Modal } from "../../../components/ui/layout";

const ProductsDialog = ({
  open,
  saving,
  sortedProducts,
  formErrors,
  formRow,
  onClose,
  onSubmit,
  updateRow,
  patchRow,
}) => (
  <Modal
    open={open}
    onClose={onClose}
    title="Добавяне на продукт"
    size="md"
  >
    <form onSubmit={onSubmit} noValidate>
      <div className="overflow-x-hidden bg-[#f8fafc] px-4 py-5 sm:px-6">
        <div className="grid grid-cols-12 gap-5">
          {formErrors._form ? (
            <div className="col-span-12">
              <p className="text-sm text-red-600">
                {formErrors._form}
              </p>
            </div>
          ) : null}
          <div className="col-span-12">
            <ProductNameField
              row={formRow}
              products={sortedProducts}
              lineSx={productRowFieldSx}
              updateRow={updateRow}
              patchRow={patchRow}
              error={formErrors.name}
            />
          </div>
          <div className="col-span-12 sm:col-span-4">
            <QuantityField row={formRow} lineSx={productRowFieldSx} updateRow={updateRow} error={formErrors.itemQuantity} />
          </div>
          <div className="col-span-12 sm:col-span-4">
            <UnitField row={formRow} lineSx={productRowFieldSx} unitOptions={COMMON_UNIT_OPTIONS} updateRow={updateRow} error={formErrors.itemUnit} />
          </div>
          <div className="col-span-12 sm:col-span-4">
            <PriceField row={formRow} lineSx={productRowFieldSx} currencySign="EUR" updateRow={updateRow} error={formErrors.priceNet} />
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2 border-t border-[rgba(15,23,42,0.08)] bg-white px-4 py-4 sm:px-6">
        <Button onClick={onClose} disabled={saving}>
          Отказ
        </Button>
        <Button type="submit" variant="contained" disabled={saving}>
          Добави продукт
        </Button>
      </div>
    </form>
  </Modal>
);

export default ProductsDialog;
