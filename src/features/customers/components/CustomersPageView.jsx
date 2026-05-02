import React, { useState } from "react";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import CustomersTable from "./CustomersTable";
import { Modal } from "../../../components/ui/layout";

const CustomersPageView = ({
  sortedCustomers,
  onOpenAddDialog,
  onDeleteCustomer,
  editingId,
  onStartEdit,
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
    await onDeleteCustomer(pendingDeleteId);
    setDeleting(false);
    setPendingDeleteId(null);
  };

  return (
    <main className="mx-auto max-w-[1100px] px-4 py-4 sm:px-6 sm:py-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-[var(--color-brand-charcoal)]">
            Клиенти
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Запазвайте клиентски данни и ги използвайте при фактуриране.
          </p>
        </div>
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
          Добави клиент
        </Button>
      </div>

      {sortedCustomers.length > 0 ? (
        <CustomersTable
          sortedCustomers={sortedCustomers}
          editingId={editingId}
          onStartEdit={onStartEdit}
          onDeleteRequest={requestDelete}
        />
      ) : (
        <section className="rounded-2xl border border-dashed border-[rgba(15,23,42,0.18)] bg-[rgba(15,23,42,0.02)] p-8 text-center sm:p-10">
          <PeopleOutlineOutlinedIcon
            sx={{ fontSize: 48, color: "var(--color-brand-primary)", mb: 1 }}
          />
          <h2 className="mb-1 text-base font-bold text-slate-900">
            Нямате добавени клиенти
          </h2>
          <p className="text-sm text-slate-500">
            Добавете първия си клиент, за да съхранявате данните му на едно
            място.
          </p>
        </section>
      )}

      <Modal
        open={Boolean(pendingDeleteId)}
        onClose={cancelDelete}
        title="Изтриване на клиент"
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
            Сигурни ли сте, че искате да изтриете този клиент? Действието не
            може да бъде отменено.
          </p>
        </div>
      </Modal>
    </main>
  );
};

export default CustomersPageView;
