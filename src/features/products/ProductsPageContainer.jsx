import React, { useEffect, useState, useCallback } from "react";
import ProductsPageView from "./components/ProductsPageView";
import ProductsDialog from "./components/ProductsDialog";
import { useProductsData } from "./hooks/useProductsData";
import { useProductCrud } from "./hooks/useProductCrud";
import { useProductForm } from "./hooks/useProductForm";
import { useInlineEdit } from "./hooks/useInlineEdit";

const ProductsPageContainer = () => {
  const { sortedProducts, refreshProducts, deleteProduct } = useProductsData();
  const { saveProduct } = useProductCrud();

  const {
    dialogOpen,
    saving,
    formErrors,
    formRow,
    openAddDialog,
    closeDialog,
    onSubmit,
    updateRow,
    patchRow,
  } = useProductForm({ onSaved: refreshProducts, saveProduct });

  const {
    editingId,
    editData,
    inlineSaving,
    inlineErrors,
    startEdit,
    cancelEdit,
    updateField,
    saveEdit,
  } = useInlineEdit({ saveProduct, onSaved: refreshProducts });

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  const handleDeleteProduct = useCallback(
    async (productId) => {
      const ok = await deleteProduct(productId);
      if (ok) await refreshProducts();
    },
    [deleteProduct, refreshProducts],
  );

  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [deleteInProgress, setDeleteInProgress] = useState(false);

  const onRequestDelete = useCallback((id) => {
    setPendingDeleteId(id);
  }, []);

  const onCancelDeleteDialog = useCallback(() => {
    if (!deleteInProgress) setPendingDeleteId(null);
  }, [deleteInProgress]);

  const onConfirmDeleteDialog = useCallback(async () => {
    if (!pendingDeleteId) return;
    setDeleteInProgress(true);
    try {
      await handleDeleteProduct(pendingDeleteId);
    } finally {
      setDeleteInProgress(false);
      setPendingDeleteId(null);
    }
  }, [pendingDeleteId, handleDeleteProduct]);

  return (
    <>
      <ProductsPageView
        sortedProducts={sortedProducts}
        onOpenAddDialog={openAddDialog}
        editingId={editingId}
        editData={editData}
        inlineSaving={inlineSaving}
        inlineErrors={inlineErrors}
        onStartEdit={startEdit}
        onCancelEdit={cancelEdit}
        onSaveEdit={saveEdit}
        onUpdateField={updateField}
        onRequestDelete={onRequestDelete}
        deleteDialogOpen={Boolean(pendingDeleteId)}
        deleteInProgress={deleteInProgress}
        onCancelDeleteDialog={onCancelDeleteDialog}
        onConfirmDeleteDialog={onConfirmDeleteDialog}
      />
      <ProductsDialog
        open={dialogOpen}
        saving={saving}
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
