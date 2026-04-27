import React, { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
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
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

import db, { auth } from "../firebase";
import { showToast } from "../utils/functions";
import { outlinedFieldSx, setupProfileFieldProps } from "../utils/muiFieldSx";
import {
  PRODUCT_CATALOG_CATEGORIES,
  PRODUCT_KINDS,
  getCategoryById,
  normalizeApplicationForCategory,
  normalizeCategoryId,
  normalizeStoredProduct,
  normalizeUnitForCategory,
  kindLabel,
} from "../data/productCatalogRules";

const VAT_OPTIONS = [20, 9, 0];

/** Полета в модала: пълна ширина, без „излизане“ от outline при select. */
const productDialogFieldSx = {
  ...outlinedFieldSx,
  mb: 0,
  width: "100%",
  minWidth: 0,
  "& .MuiOutlinedInput-root": {
    maxWidth: "100%",
  },
  "& .MuiSelect-select": {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    pr: "36px !important",
  },
};

const firstCat = PRODUCT_CATALOG_CATEGORIES[0];
const EMPTY_FORM = {
  name: "",
  price: "",
  kind: "product",
  category: firstCat.id,
  application: firstCat.applications[0],
  unit: firstCat.units[0],
  vat: 20,
};

function Products() {
  const [products, setProducts] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [formData, setFormData] = useState(EMPTY_FORM);

  const editing = Boolean(editingId);

  useEffect(() => {
    fetchProducts();
  }, []);

  const sortedProducts = useMemo(
    () =>
      [...products].sort((a, b) =>
        String(a?.name || "").localeCompare(String(b?.name || ""), "bg")
      ),
    [products]
  );

  const formCategory = useMemo(
    () => getCategoryById(normalizeCategoryId(formData.category)),
    [formData.category]
  );

  const fetchProducts = async () => {
    try {
      const userId = auth.currentUser.uid;
      const querySnapshot = await getDocs(collection(db, "users", userId, "products"));
      const fetchedProducts = querySnapshot.docs.map((d) =>
        normalizeStoredProduct(d.data(), d.id)
      );
      setProducts(fetchedProducts);
    } catch {
      showToast("error", "Моля, свържете се с техническа поддръжка.");
    }
  };

  const openAddDialog = () => {
    setEditingId("");
    setFormData(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEditDialog = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name || "",
      price: String(product.price ?? ""),
      kind: product.kind === "service" ? "service" : "product",
      category: normalizeCategoryId(product.category),
      application: product.application || firstCat.applications[0],
      unit: product.unit || firstCat.units[0],
      vat: Number.isFinite(Number(product.vat)) ? Number(product.vat) : 20,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (saving) return;
    setDialogOpen(false);
    setEditingId("");
    setFormData(EMPTY_FORM);
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    const name = String(formData.name || "").trim();
    const price = Number(formData.price);
    const kind = formData.kind === "service" ? "service" : "product";
    const category = normalizeCategoryId(formData.category);
    const unit = normalizeUnitForCategory(category, formData.unit);
    const application = normalizeApplicationForCategory(category, formData.application);
    const vat = Number(formData.vat);

    if (!name || !Number.isFinite(price) || price < 0 || !VAT_OPTIONS.includes(vat)) {
      showToast("error", "Попълнете всички задължителни полета коректно.");
      return;
    }

    const payload = { name, price, kind, category, application, unit, vat };
    try {
      setSaving(true);
      const userId = auth.currentUser.uid;
      if (editing) {
        await updateDoc(doc(db, "users", userId, "products", editingId), payload);
      } else {
        await addDoc(collection(db, "users", userId, "products"), payload);
      }
      await fetchProducts();
      closeDialog();
      showToast("success", editing ? "Продуктът е обновен успешно." : "Продуктът е добавен успешно.");
    } catch {
      showToast("error", "Моля, свържете се с техническа поддръжка.");
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
    <Box sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 2.5 }, maxWidth: 1100, mx: "auto" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2.5 }}>
        <Typography variant="h6" component="h1" sx={{ fontWeight: 700, color: "var(--color-brand-charcoal)" }}>
          Продукти и услуги
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAddDialog}>
          Добави продукт
        </Button>
      </Stack>

      {sortedProducts.length > 0 ? (
        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{ borderRadius: 2, maxWidth: "100%", overflowX: "auto" }}
        >
          <Table size="small" sx={{ minWidth: 720 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "rgba(15, 23, 42, 0.04)" }}>
                <TableCell sx={{ fontWeight: 700 }}>Име</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Вид</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Категория</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Подкатегория</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Мярка</TableCell>
                <TableCell sx={{ fontWeight: 700, textAlign: "right" }}>ДДС %</TableCell>
                <TableCell sx={{ fontWeight: 700, textAlign: "right" }}>Цена</TableCell>
                <TableCell sx={{ fontWeight: 700, textAlign: "right" }}>Действия</TableCell>
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
                    }}
                  >
                    {product.name}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>{kindLabel(product.kind)}</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {getCategoryById(product.category).label}
                  </TableCell>
                  <TableCell
                    sx={{
                      maxWidth: 160,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={product.application}
                  >
                    {product.application}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>{product.unit}</TableCell>
                  <TableCell sx={{ textAlign: "right" }}>{Number(product.vat).toFixed(0)}%</TableCell>
                  <TableCell sx={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                    {Number(product.price).toFixed(2)} EUR
                  </TableCell>
                  <TableCell sx={{ textAlign: "right" }}>
                    <IconButton size="small" onClick={() => openEditDialog(product)} aria-label="Редакция на продукт">
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
          <Inventory2OutlinedIcon sx={{ fontSize: 48, color: "var(--color-brand-primary)", mb: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
            Нямате добавени продукти
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Спестете време при фактуриране! Добавете първия си продукт и той ще се попълва автоматично.
          </Typography>
        </Paper>
      )}

      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        maxWidth="md"
        fullWidth
        scroll="paper"
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          {editing ? "Редакция на продукт" : "Добавяне на продукт"}
        </DialogTitle>
        <Box component="form" onSubmit={saveProduct}>
          <DialogContent
            dividers
            sx={{
              pt: 0,
              px: { xs: 2, sm: 3 },
              overflowX: "hidden",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  {...setupProfileFieldProps}
                  label="Име на продукт / услуга"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="напр. Консултация"
                  sx={productDialogFieldSx}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...setupProfileFieldProps}
                  select
                  label="Вид"
                  value={formData.kind}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, kind: e.target.value }))
                  }
                  sx={productDialogFieldSx}
                >
                  {PRODUCT_KINDS.map((k) => (
                    <MenuItem key={k.id} value={k.id}>
                      {k.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...setupProfileFieldProps}
                  select
                  label="Категория"
                  value={formCategory.id}
                  onChange={(e) => {
                    const catId = e.target.value;
                    const c = getCategoryById(catId);
                    setFormData((prev) => ({
                      ...prev,
                      category: catId,
                      unit: c.units.includes(prev.unit) ? prev.unit : c.units[0],
                      application: c.applications.includes(prev.application)
                        ? prev.application
                        : c.applications[0],
                    }));
                  }}
                  sx={productDialogFieldSx}
                >
                  {PRODUCT_CATALOG_CATEGORIES.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...setupProfileFieldProps}
                  select
                  label="Подкатегория / приложение"
                  value={
                    formCategory.applications.includes(formData.application)
                      ? formData.application
                      : formCategory.applications[0]
                  }
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, application: e.target.value }))
                  }
                  sx={productDialogFieldSx}
                >
                  {formCategory.applications.map((a) => (
                    <MenuItem key={a} value={a}>
                      {a}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...setupProfileFieldProps}
                  select
                  label="Мерна единица"
                  value={
                    formCategory.units.includes(formData.unit)
                      ? formData.unit
                      : formCategory.units[0]
                  }
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, unit: e.target.value }))
                  }
                  sx={productDialogFieldSx}
                >
                  {formCategory.units.map((u) => (
                    <MenuItem key={u} value={u}>
                      {u}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...setupProfileFieldProps}
                  type="number"
                  label="Единична цена"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, price: e.target.value }))
                  }
                  inputProps={{ min: 0, step: "0.01" }}
                  placeholder="напр. 100.00"
                  sx={productDialogFieldSx}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...setupProfileFieldProps}
                  select
                  label="ДДС ставка по подразбиране"
                  value={formData.vat}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, vat: Number(e.target.value) }))
                  }
                  sx={productDialogFieldSx}
                >
                  {VAT_OPTIONS.map((vat) => (
                    <MenuItem key={vat} value={vat}>
                      {vat}%
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
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
