import React, { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

import db, { auth } from "../firebase";
import { showToast } from "../utils/functions";
import { inlineCellSx } from "../utils/muiFieldSx";
import {
  dataTableSx,
  numericCellSx,
  tableSurfaceSx,
} from "../utils/tableStyles";
import { createProductSchema } from "../schemas/productSchema";
import {
  invoiceLineFieldSx,
  COMMON_UNIT_OPTIONS,
} from "../components/createInvoice/ProductRow/styles";
import { ProductNameField } from "../components/createInvoice/ProductRow/fields/ProductNameField";
import { QuantityField } from "../components/createInvoice/ProductRow/fields/QuantityField";
import { UnitField } from "../components/createInvoice/ProductRow/fields/UnitField";
import { PriceField } from "../components/createInvoice/ProductRow/fields/PriceField";
import { VatField } from "../components/createInvoice/ProductRow/fields/VatField";
import { normalizeStoredProduct } from "../data/productCatalogRules";

const VAT_OPTIONS = [20, 9, 0];

const FORM_ROW_ID = 1;
const EMPTY_FORM = {
  itemName: "",
  itemQuantity: "1",
  itemUnit: COMMON_UNIT_OPTIONS[0],
  itemCost: "",
  itemVatRate: 20,
};

function Products() {
  const [products, setProducts] = useState([]);
  const [isBusinessVatRegistered, setIsBusinessVatRegistered] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const lineSx = useMemo(() => invoiceLineFieldSx(inlineCellSx), []);
  const formRow = useMemo(
    () => ({ ...formData, _rowId: FORM_ROW_ID }),
    [formData],
  );

  const editing = Boolean(editingId);

  useEffect(() => {
    fetchProducts();
    fetchBusinessMeta();
  }, []);

  const sortedProducts = useMemo(
    () =>
      [...products].sort((a, b) =>
        String(a?.name || "").localeCompare(String(b?.name || ""), "bg"),
      ),
    [products],
  );

  const fetchProducts = async () => {
    try {
      const userId = auth.currentUser.uid;
      const querySnapshot = await getDocs(
        collection(db, "users", userId, "products"),
      );
      const fetchedProducts = querySnapshot.docs.map((d) =>
        normalizeStoredProduct(d.data(), d.id),
      );
      setProducts(fetchedProducts);
    } catch {
      showToast("error", "Моля, свържете се с техническа поддръжка.");
    }
  };

  const fetchBusinessMeta = async () => {
    try {
      const userId = auth.currentUser.uid;
      const businessSnapshot = await getDocs(
        query(collection(db, "businesses"), where("user_id", "==", userId)),
      );
      if (businessSnapshot.empty) return;
      const data = businessSnapshot.docs[0]?.data?.() || {};
      setIsBusinessVatRegistered(data?.isVatRegistered !== false);
    } catch {
      // Keep page usable if metadata request fails.
    }
  };

  const openAddDialog = () => {
    setEditingId("");
    setFormData({
      ...EMPTY_FORM,
      itemVatRate: isBusinessVatRegistered ? EMPTY_FORM.itemVatRate : 0,
    });
    setFormErrors({});
    setDialogOpen(true);
  };

  const openEditDialog = (product) => {
    setEditingId(product.id);
    setFormData({
      itemName: product.name || "",
      itemQuantity: String(product.quantityDefault ?? 1),
      itemUnit: product.unit || COMMON_UNIT_OPTIONS[0],
      itemCost: String(product.price ?? ""),
      itemVatRate: isBusinessVatRegistered
        ? Number.isFinite(Number(product.vat))
          ? Number(product.vat)
          : 20
        : 0,
    });
    setFormErrors({});
    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (saving) return;
    setDialogOpen(false);
    setEditingId("");
    setFormData(EMPTY_FORM);
    setFormErrors({});
  };

  const updateField = (field, value) => {
    const normalizedValue =
      field === "itemVatRate" && !isBusinessVatRegistered ? 0 : value;
    setFormData((prev) => ({ ...prev, [field]: normalizedValue }));
    setFormErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };
  const updateRow = (rowId, field, value) => {
    if (rowId !== FORM_ROW_ID) return;
    updateField(field, value);
  };
  const patchRow = (rowId, patch) => {
    if (rowId !== FORM_ROW_ID || !patch || typeof patch !== "object") return;
    const normalizedPatch = { ...patch };
    if (!isBusinessVatRegistered) normalizedPatch.itemVatRate = 0;

    setFormData((prev) => ({ ...prev, ...normalizedPatch }));
    setFormErrors((prev) => {
      const next = { ...prev };
      Object.keys(normalizedPatch).forEach((field) => {
        delete next[field];
      });
      return next;
    });
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    const schema = createProductSchema({
      isBusinessVatRegistered,
      vatOptions: VAT_OPTIONS,
    });
    const parseResult = schema.safeParse({
      itemName: formData.itemName,
      itemQuantity: formData.itemQuantity,
      itemUnit: formData.itemUnit,
      itemCost: formData.itemCost,
      itemVatRate: isBusinessVatRegistered ? formData.itemVatRate : 0,
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

    const { itemName, itemQuantity, itemUnit, itemCost, itemVatRate } =
      parseResult.data;
    setFormErrors({});

    const payload = {
      name: itemName,
      price: itemCost,
      unit: itemUnit,
      vat: itemVatRate,
      quantityDefault: itemQuantity,
    };
    try {
      setSaving(true);
      const userId = auth.currentUser.uid;
      if (editing) {
        await updateDoc(
          doc(db, "users", userId, "products", editingId),
          payload,
        );
      } else {
        await addDoc(collection(db, "users", userId, "products"), payload);
      }
      await fetchProducts();
      closeDialog();
    } catch {
      setFormErrors((prev) => ({
        ...prev,
        _form: "Моля, свържете се с техническа поддръжка.",
      }));
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const userId = auth.currentUser.uid;
      await deleteDoc(doc(db, "users", userId, "products", productId));
      showToast("success", "Продуктът е изтрит успешно.");
      fetchProducts();
    } catch {
      showToast("error", "Моля, свържете се с техническа поддръжка.");
    }
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
          startIcon={<AddIcon />}
          onClick={openAddDialog}
        >
          Добави продукт
        </Button>
      </Stack>

      {sortedProducts.length > 0 ? (
        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{ ...tableSurfaceSx, maxWidth: "100%", overflowX: "auto" }}
        >
          <Table size="small" sx={{ ...dataTableSx, minWidth: 720 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Име</TableCell>
                <TableCell sx={{ fontWeight: 700, textAlign: "right" }}>
                  Кол-во
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Мярка</TableCell>
                <TableCell sx={{ fontWeight: 700, textAlign: "right" }}>
                  ДДС %
                </TableCell>
                <TableCell sx={{ fontWeight: 700, textAlign: "right" }}>
                  Цена
                </TableCell>
                <TableCell
                  className="table-actions-cell"
                  sx={{ fontWeight: 700, textAlign: "right" }}
                >
                  Действия
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedProducts.map((product) => (
                <TableRow key={product.id} hover>
                  <TableCell
                    sx={{
                      maxWidth: 200,
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      color: "#1A1A1A",
                      fontWeight: 600,
                    }}
                  >
                    {product.name}
                  </TableCell>
                  <TableCell
                    className="table-number-cell"
                    sx={{
                      ...numericCellSx,
                      textAlign: "right",
                      color: "#6B7280",
                    }}
                  >
                    {Number(product.quantityDefault || 1).toFixed(2)}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap", color: "#6B7280" }}>
                    {product.unit}
                  </TableCell>
                  <TableCell
                    className="table-number-cell"
                    sx={{ ...numericCellSx, color: "#6B7280" }}
                  >
                    {isBusinessVatRegistered
                      ? `${Number(product.vat).toFixed(0)}%`
                      : "—"}
                  </TableCell>
                  <TableCell
                    className="table-number-cell"
                    sx={{
                      ...numericCellSx,
                      textAlign: "right",
                      color: "#6B7280",
                    }}
                  >
                    {Number(product.price).toFixed(2)} EUR
                  </TableCell>
                  <TableCell className="table-actions-cell">
                    <Box className="table-actions-wrap">
                      <IconButton
                        size="small"
                        onClick={() => openEditDialog(product)}
                        aria-label="Редакция на продукт"
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => deleteProduct(product.id)}
                        aria-label="Изтрий продукт"
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
        open={dialogOpen}
        onClose={closeDialog}
        maxWidth="md"
        fullWidth
        scroll="paper"
        PaperProps={{
          sx: {
            borderRadius: 2.5,
            overflow: "hidden",
            bgcolor: "#f8fafc",
            border: "1px solid rgba(15,23,42,0.08)",
            boxShadow: "0 16px 44px rgba(2,6,23,0.18)",
          },
        }}
      >
        <DialogTitle
          sx={{
            pb: 1.5,
            pt: 2,
            px: { xs: 2, sm: 3 },
            fontWeight: 700,
            bgcolor: "#fff",
            borderBottom: "1px solid rgba(15,23,42,0.08)",
          }}
        >
          {editing ? "Редакция на продукт" : "Добавяне на продукт"}
        </DialogTitle>
        <Box component="form" onSubmit={saveProduct} noValidate>
          <DialogContent
            sx={{
              pt: 2.5,
              px: { xs: 2, sm: 3 },
              pb: 2.5,
              overflowX: "hidden",
              bgcolor: "#f8fafc",
            }}
          >
            <Grid container spacing={2.25}>
              {formErrors._form ? (
                <Grid item xs={12}>
                  <Typography variant="body2" color="error">
                    {formErrors._form}
                  </Typography>
                </Grid>
              ) : null}
              <Grid item xs={12}>
                <ProductNameField
                  row={formRow}
                  products={products}
                  lineSx={lineSx}
                  updateRow={updateRow}
                  patchRow={patchRow}
                  error={formErrors.itemName}
                />
              </Grid>
              {!isBusinessVatRegistered ? (
                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      px: 0.25,
                    }}
                  >
                    Фирмата не е регистрирана по ДДС. Продуктите се записват с
                    0% ДДС.
                  </Typography>
                </Grid>
              ) : null}
              <Grid item xs={12} sm={4}>
                <QuantityField
                  row={formRow}
                  lineSx={lineSx}
                  updateRow={updateRow}
                  error={formErrors.itemQuantity}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <UnitField
                  row={formRow}
                  lineSx={lineSx}
                  unitOptions={COMMON_UNIT_OPTIONS}
                  updateRow={updateRow}
                  error={formErrors.itemUnit}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <PriceField
                  row={formRow}
                  lineSx={lineSx}
                  currencySign="€"
                  updateRow={updateRow}
                  error={formErrors.itemCost}
                />
              </Grid>
              {isBusinessVatRegistered ? (
                <Grid item xs={12} sm={6}>
                  <VatField
                    row={formRow}
                    lineSx={lineSx}
                    showVatField={isBusinessVatRegistered}
                    vatRateOptions={VAT_OPTIONS}
                    updateRow={updateRow}
                    error={formErrors.itemVatRate}
                  />
                </Grid>
              ) : null}
            </Grid>
          </DialogContent>
          <DialogActions
            sx={{
              px: { xs: 2, sm: 3 },
              py: 2,
              bgcolor: "#fff",
              borderTop: "1px solid rgba(15,23,42,0.08)",
            }}
          >
            <Button onClick={closeDialog} disabled={saving}>
              Отказ
            </Button>
            <Button type="submit" variant="contained" disabled={saving}>
              {editing ? "Запази промените" : "Добави продукт"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}

export default Products;
