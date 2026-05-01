import { COMMON_UNIT_OPTIONS } from "../../../components/product-row-fields";

export const PRODUCT_FORM_ROW_ID = 1;

export const createEmptyProductForm = () => ({
  name: "",
  itemQuantity: "1",
  itemUnit: COMMON_UNIT_OPTIONS[0],
  priceNet: "",
});
