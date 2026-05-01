import { useState, useCallback } from "react";
import { createProductSchema } from "../../../schemas/productSchema";
import { COMMON_UNIT_OPTIONS } from "../../../components/product-row-fields";

export const useInlineEdit = ({ saveProduct, onSaved }) => {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const startEdit = useCallback((product) => {
    setEditingId(product.id);
    setEditData({
      name: product.name || "",
      itemQuantity: String(product.quantityDefault ?? 1),
      itemUnit: product.unit || COMMON_UNIT_OPTIONS[0],
      priceNet: String(product.price ?? ""),
    });
    setErrors({});
  }, []);

  const cancelEdit = useCallback(() => {
    if (saving) return;
    setEditingId(null);
    setEditData(null);
    setErrors({});
  }, [saving]);

  const updateField = useCallback((field, value) => {
    setEditData((prev) => (prev ? { ...prev, [field]: value } : prev));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const saveEdit = useCallback(async () => {
    if (!editData || !editingId) return;
    const schema = createProductSchema();
    const result = schema.safeParse(editData);
    if (!result.success) {
      const nextErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path?.[0];
        if (field && !nextErrors[field]) nextErrors[field] = issue.message;
      });
      setErrors(nextErrors);
      return;
    }
    setSaving(true);
    try {
      await saveProduct({ editingId, productData: result.data });
      await onSaved();
      setEditingId(null);
      setEditData(null);
      setErrors({});
    } catch {
      setErrors((prev) => ({ ...prev, _form: "Грешка при запазване. Опитайте отново." }));
    } finally {
      setSaving(false);
    }
  }, [editData, editingId, onSaved, saveProduct]);

  return { editingId, editData, inlineSaving: saving, inlineErrors: errors, startEdit, cancelEdit, updateField, saveEdit };
};
