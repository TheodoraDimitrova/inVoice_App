import { useCallback, useState } from "react";
import { customerSchema } from "../../../schemas/customerSchema";
import { createEmptyCustomerForm } from "../constants/customerConstants";

const toFieldErrors = (issues) => {
  const nextErrors = {};
  issues.forEach((issue) => {
    const field = issue.path?.[0];
    if (typeof field === "string" && !nextErrors[field]) {
      nextErrors[field] = issue.message;
    }
  });
  return nextErrors;
};

export const useCustomerForm = ({ onSaved, saveCustomer }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [formData, setFormData] = useState(createEmptyCustomerForm());
  const [formErrors, setFormErrors] = useState({});

  const openAddDialog = useCallback(() => {
    setEditingId("");
    setFormData(createEmptyCustomerForm());
    setFormErrors({});
    setDialogOpen(true);
  }, []);

  const openEditDialog = useCallback((customer) => {
    setEditingId(customer.id);
    setFormData({
      customerType: customer.customerType || "business",
      customerName: customer.customerName || "",
      customerCountry: customer.customerCountry || "Bulgaria",
      companyIdentifier: customer.companyIdentifier || "",
      customerVatRegistered: Boolean(customer.customerVatRegistered),
      customerVatNumber: customer.customerVatNumber || "",
      customerAddress: customer.customerAddress || "",
      customerPostCode: customer.customerPostCode || "",
      customerCity: customer.customerCity || "",
      customerEmail: customer.customerEmail || "",
    });
    setFormErrors({});
    setDialogOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    if (saving) return;
    setDialogOpen(false);
    setEditingId("");
    setFormData(createEmptyCustomerForm());
    setFormErrors({});
  }, [saving]);

  const updateField = useCallback((field, value) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "customerType" && value === "individual") {
        next.companyIdentifier = "";
        next.customerVatRegistered = false;
        next.customerVatNumber = "";
      }
      if (field === "customerVatRegistered" && !value) {
        next.customerVatNumber = "";
      }
      return next;
    });
    setFormErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      if (field === "customerType" && value === "individual") {
        delete next.companyIdentifier;
        delete next.customerVatNumber;
      }
      if (field === "customerVatRegistered" && !value) {
        delete next.customerVatNumber;
      }
      return Object.keys(next).length === Object.keys(prev).length ? prev : next;
    });
  }, []);

  const setFieldFromEvent = useCallback(
    (field, transform) => (event) => {
      updateField(field, transform ? transform(event) : event.target.value);
    },
    [updateField],
  );

  const handleCustomerTypeChange = useCallback(
    (_, value) => {
      if (!value) return;
      updateField("customerType", value);
    },
    [updateField],
  );

  const handleCustomerVatRegisteredChange = useCallback(
    (event) => {
      updateField("customerVatRegistered", Boolean(event.target.checked));
    },
    [updateField],
  );

  const onSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      const parseResult = customerSchema.safeParse(formData);

      if (!parseResult.success) {
        setFormErrors(toFieldErrors(parseResult.error.issues));
        return;
      }

      setFormErrors({});
      setSaving(true);
      try {
        await saveCustomer({ editingId, customerData: parseResult.data });
        await onSaved();
        closeDialog();
      } catch (err) {
        console.error("[CustomerForm] saveCustomer failed:", err);
        setFormErrors((prev) => ({
          ...prev,
          _form: "Моля, свържете се с техническа поддръжка.",
        }));
      } finally {
        setSaving(false);
      }
    },
    [closeDialog, editingId, formData, onSaved, saveCustomer],
  );

  return {
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
  };
};
