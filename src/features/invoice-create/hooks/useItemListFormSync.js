import { useEffect } from "react";

export const useItemListFormSync = ({ itemList, setValue }) => {
  useEffect(() => {
    setValue("itemList", itemList, {
      shouldDirty: false,
      shouldValidate: false,
    });
  }, [itemList, setValue]);
};
