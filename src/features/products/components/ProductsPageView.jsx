import React, { useState } from "react";
import {
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ProductsTable from "./ProductsTable";
import { Modal } from "../../../components/ui/layout";

const ProductsPageView = ({
  sortedProducts,
  onOpenAddDialog,
  onDeleteProduct,
  editingId,
  editData,
  inlineSaving,
  inlineErrors,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onUpdateField,
}) => {
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const requestDelete = (id) => setPendingDeleteId(id);
  const cancelDelete = () => {
    if (!deleting) setPendingDeleteId(null);
  };
  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    setDeleting(true);
    await onDeleteProduct(pendingDeleteId);
    setDeleting(false);
    setPendingDeleteId(null);
  };

  return (
    <main className="mx-auto max-w-[1100px] px-4 py-4 sm:px-6 sm:py-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-lg font-bold text-[var(--color-brand-charcoal)]">
          Продукти или услуги
        </h1>
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<AddIcon />}
          onClick={onOpenAddDialog}
          disabled={Boolean(editingId)}
          sx={{
            minHeight: 40,
            px: 1.75,
            fontWeight: 600,
            textTransform: "none",
            boxShadow:
              "0 2px 12px rgba(15, 118, 110, 0.12), 0 1px 4px rgba(15, 23, 42, 0.06)",
          }}
        >
          Добави продукт
        </Button>
      </div>

      {sortedProducts.length > 0 ? (
        <ProductsTable
          sortedProducts={sortedProducts}
          editingId={editingId}
          editData={editData}
          inlineSaving={inlineSaving}
          inlineErrors={inlineErrors}
          onStartEdit={onStartEdit}
          onCancelEdit={onCancelEdit}
          onSaveEdit={onSaveEdit}
          onUpdateField={onUpdateField}
          onDeleteRequest={requestDelete}
        />
      ) : (
        <section className="rounded-2xl border border-dashed border-[rgba(15,23,42,0.18)] bg-[rgba(15,23,42,0.02)] p-8 text-center sm:p-10">
          <Inventory2OutlinedIcon
            sx={{ fontSize: 48, color: "var(--color-brand-primary)", mb: 1 }}
          />
          <h2 className="mb-1 text-base font-bold text-slate-900">
            Нямате добавени продукти
          </h2>
          <p className="text-sm text-slate-500">
            Спестете време при фактуриране! Добавете първия си продукт и той ще
            се попълва автоматично.
          </p>
        </section>
      )}

      <Modal
        open={Boolean(pendingDeleteId)}
        onClose={cancelDelete}
        title="Изтриване на продукт"
        size="xs"
        footer={
          <>
            <Button onClick={cancelDelete} disabled={deleting}>
              Отказ
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={confirmDelete}
              disabled={deleting}
            >
              Изтрий
            </Button>
          </>
        }
      >
        <div className="p-5">
          <p className="text-sm text-slate-600">
            Сигурни ли сте, че искате да изтриете този продукт? Действието не
            може да бъде отменено.
          </p>
        </div>
      </Modal>
    </main>
  );
};

export default ProductsPageView;
