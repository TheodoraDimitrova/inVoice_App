import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ProductsTable from "./ProductsTable";

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
    <Box
      sx={{
        px: { xs: 2, sm: 3 },
        py: { xs: 2, sm: 2.5 },
        maxWidth: 1100,
        mx: "auto",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2.5 }}
      >
        <Typography
          variant="h6"
          component="h1"
          sx={{ fontWeight: 700, color: "var(--color-brand-charcoal)" }}
        >
          Продукти или услуги
        </Typography>
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
      </Stack>

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
        <Paper
          variant="outlined"
          sx={{
            borderRadius: 2,
            p: { xs: 3, sm: 4 },
            textAlign: "center",
            borderStyle: "dashed",
            borderColor: "rgba(15, 23, 42, 0.18)",
            bgcolor: "rgba(15, 23, 42, 0.02)",
          }}
        >
          <Inventory2OutlinedIcon
            sx={{ fontSize: 48, color: "var(--color-brand-primary)", mb: 1 }}
          />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
            Нямате добавени продукти
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Спестете време при фактуриране! Добавете първия си продукт и той ще
            се попълва автоматично.
          </Typography>
        </Paper>
      )}

      <Dialog
        open={Boolean(pendingDeleteId)}
        onClose={cancelDelete}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Изтриване на продукт</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Сигурни ли сте, че искате да изтриете този продукт? Действието не
            може да бъде отменено.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
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
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductsPageView;
