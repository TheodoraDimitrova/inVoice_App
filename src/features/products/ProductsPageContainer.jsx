import React, { useEffect } from "react";
import ProductsPageView from "./components/ProductsPageView";
import ProductsDialog from "./components/ProductsDialog";
import { useProductsData } from "./hooks/useProductsData";
import { useProductCrud } from "./hooks/useProductCrud";
import { useProductForm } from "./hooks/useProductForm";

const ProductsPageContainer = () => {
  const { sortedProducts, refreshProducts, deleteProduct } = useProductsData();
  const { saveProduct } = useProductCrud();
  const {
    dialogOpen,
    saving,
    editingId,
    formErrors,
    formRow,
    openAddDialog,
    openEditDialog,
    closeDialog,
    onSubmit,
    updateRow,
    patchRow,
  } = useProductForm({
    onSaved: refreshProducts,
    saveProduct,
  });

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  const handleDeleteProduct = async (productId) => {
    const ok = await deleteProduct(productId);
    if (ok) await refreshProducts();
  };

  return (
    <>
      <ProductsPageView
        sortedProducts={sortedProducts}
        onOpenAddDialog={openAddDialog}
        onOpenEditDialog={openEditDialog}
        onDeleteProduct={handleDeleteProduct}
      />
      <ProductsDialog
        open={dialogOpen}
        saving={saving}
        editing={Boolean(editingId)}
        sortedProducts={sortedProducts}
        formErrors={formErrors}
        formRow={formRow}
        onClose={closeDialog}
        onSubmit={onSubmit}
        updateRow={updateRow}
        patchRow={patchRow}
      />
    </>
  );
};

export default ProductsPageContainer;
