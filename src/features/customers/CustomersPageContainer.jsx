import React, { useEffect, useState, useCallback } from "react";
import CustomersDialog from "./components/CustomersDialog";
import CustomersPageView from "./components/CustomersPageView";
import { useCustomerCrud } from "./hooks/useCustomerCrud";
import { useCustomerForm } from "./hooks/useCustomerForm";
import { useCustomersData } from "./hooks/useCustomersData";

const CustomersPageContainer = () => {
  const { sortedCustomers, refreshCustomers, deleteCustomer } = useCustomersData();
  const { saveCustomer } = useCustomerCrud();

  const {
    dialogOpen,
    saving,
    editingId,
    formData,
    formErrors,
    openAddDialog,
    openEditDialog,
    closeDialog,
    onSubmit,
    setFieldFromEvent,
    handleCustomerTypeChange,
    handleCustomerVatRegisteredChange,
  } = useCustomerForm({ onSaved: refreshCustomers, saveCustomer });

  useEffect(() => {
    refreshCustomers();
  }, [refreshCustomers]);

  const handleDeleteCustomer = useCallback(
    async (customerId) => {
      const ok = await deleteCustomer(customerId);
      if (ok) await refreshCustomers();
    },
    [deleteCustomer, refreshCustomers],
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
      await handleDeleteCustomer(pendingDeleteId);
    } finally {
      setDeleteInProgress(false);
      setPendingDeleteId(null);
    }
  }, [pendingDeleteId, handleDeleteCustomer]);

  return (
    <>
      <CustomersPageView
        sortedCustomers={sortedCustomers}
        onOpenAddDialog={openAddDialog}
        editingId={editingId}
        onStartEdit={openEditDialog}
        onRequestDelete={onRequestDelete}
        deleteDialogOpen={Boolean(pendingDeleteId)}
        deleteInProgress={deleteInProgress}
        onCancelDeleteDialog={onCancelDeleteDialog}
        onConfirmDeleteDialog={onConfirmDeleteDialog}
      />
      <CustomersDialog
        open={dialogOpen}
        saving={saving}
        editingId={editingId}
        formData={formData}
        formErrors={formErrors}
        onClose={closeDialog}
        onSubmit={onSubmit}
        setFieldFromEvent={setFieldFromEvent}
        onCustomerTypeChange={handleCustomerTypeChange}
        onCustomerVatRegisteredChange={handleCustomerVatRegisteredChange}
      />
    </>
  );
};

export default CustomersPageContainer;
