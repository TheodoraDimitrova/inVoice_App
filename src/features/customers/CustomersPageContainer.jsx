import React, { useEffect } from "react";
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

  const handleDeleteCustomer = async (customerId) => {
    const ok = await deleteCustomer(customerId);
    if (ok) await refreshCustomers();
  };

  return (
    <>
      <CustomersPageView
        sortedCustomers={sortedCustomers}
        onOpenAddDialog={openAddDialog}
        onDeleteCustomer={handleDeleteCustomer}
        editingId={editingId}
        onStartEdit={openEditDialog}
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
