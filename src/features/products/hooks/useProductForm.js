import { useCallback, useMemo, useState } from "react";
import { createProductSchema } from "../../../schemas/productSchema";
import {
  PRODUCT_FORM_ROW_ID,
  createEmptyProductForm,
} from "../constants/productConstants";
import { COMMON_UNIT_OPTIONS } from "../../../components/product-row-fields";

export const useProductForm = ({ onSaved, saveProduct }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [formData, setFormData] = useState(createEmptyProductForm());
  const [formErrors, setFormErrors] = useState({});

  const formRow = useMemo(
    () => ({ ...formData, _rowId: PRODUCT_FORM_ROW_ID }),
    [formData]
  );

  const openAddDialog = useCallback(() => {
    setEditingId("");
    setFormData(createEmptyProductForm());
    setFormErrors({});
    setDialogOpen(true);
  }, []);

  const openEditDialog = useCallback(
    (product) => {
      setEditingId(product.id);
      setFormData({
        name: product.name || "",
        itemQuantity: String(product.quantityDefault ?? 1),
        itemUnit: product.unit || COMMON_UNIT_OPTIONS[0],
        priceNet: String(product.price ?? ""),
      });
      setFormErrors({});
      setDialogOpen(true);
    },
    []
  );

  const closeDialog = useCallback(() => {
    if (saving) return;
    setDialogOpen(false);
    setEditingId("");
    setFormData(createEmptyProductForm());
    setFormErrors({});
  }, [saving]);

  const updateField = useCallback(
    (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setFormErrors((prev) => {
        if (!prev[field]) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    []
  );

  const updateRow = useCallback(
    (rowId, field, value) => {
      if (rowId !== PRODUCT_FORM_ROW_ID) return;
      updateField(field, value);
    },
    [updateField]
  );

  const patchRow = useCallback(
    (rowId, patch) => {
      if (rowId !== PRODUCT_FORM_ROW_ID || !patch || typeof patch !== "object") return;
      setFormData((prev) => ({ ...prev, ...patch }));
      setFormErrors((prev) => {
        const next = { ...prev };
        Object.keys(patch).forEach((field) => delete next[field]);
        return next;
      });
    },
    []
  );

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const schema = createProductSchema();
      const parseResult = schema.safeParse({
        name: formData.name,
        itemQuantity: formData.itemQuantity,
        itemUnit: formData.itemUnit,
        priceNet: formData.priceNet,
      });

      if (!parseResult.success) {
        const nextErrors = {};
        parseResult.error.issues.forEach((issue) => {
          const field = issue.path?.[0];
          if (typeof field === "string" && !nextErrors[field]) {
            nextErrors[field] = issue.message;
          }
        });
        setFormErrors(nextErrors);
        return;
      }

      setFormErrors({});
      setSaving(true);
      try {
        await saveProduct({
          editingId,
          productData: parseResult.data,
        });
        await onSaved();
        closeDialog();
      } catch (err) {
        console.error("[ProductForm] saveProduct failed:", err);
        setFormErrors((prev) => ({
          ...prev,
          _form: "Моля, свържете се с техническа поддръжка.",
        }));
      } finally {
        setSaving(false);
      }
    },
    [
      closeDialog,
      editingId,
      formData.name,
      formData.itemQuantity,
      formData.itemUnit,
      formData.priceNet,
      onSaved,
      saveProduct,
    ]
  );

  return {
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
  };
};
