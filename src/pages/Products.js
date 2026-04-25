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

const UNIT_OPTIONS = ["бр.", "час", "услуга", "месец"];
const VAT_OPTIONS = [20, 9, 0];

const EMPTY_FORM = {
  name: "",
  price: "",
  unit: "бр.",
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

  const fetchProducts = async () => {
    try {
      const userId = auth.currentUser.uid;
      const querySnapshot = await getDocs(collection(db, "users", userId, "products"));
      const fetchedProducts = querySnapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          name: data.name || "",
          price: Number(data.price) || 0,
          unit: data.unit || "бр.",
          vat: Number.isFinite(Number(data.vat)) ? Number(data.vat) : 20,
        };
      });
      setProducts(fetchedProducts);
    } catch (error) {
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
      unit: product.unit || "бр.",
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
    const unit = String(formData.unit || "").trim();
    const vat = Number(formData.vat);

    if (!name || !Number.isFinite(price) || price < 0 || !unit || !VAT_OPTIONS.includes(vat)) {
      showToast("error", "Попълнете всички задължителни полета коректно.");
      return;
    }

    const payload = { name, price, unit, vat };
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
          + Добави продукт
        </Button>
      </Stack>

      {sortedProducts.length > 0 ? (
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "rgba(15, 23, 42, 0.04)" }}>
                <TableCell sx={{ fontWeight: 700 }}>Име</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Мерна единица</TableCell>
                <TableCell sx={{ fontWeight: 700, textAlign: "right" }}>ДДС %</TableCell>
                <TableCell sx={{ fontWeight: 700, textAlign: "right" }}>Цена</TableCell>
                <TableCell sx={{ fontWeight: 700, textAlign: "right" }}>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedProducts.map((product) => (
                <TableRow key={product.id} hover>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.unit}</TableCell>
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

      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? "Редакция на продукт" : "Добавяне на продукт"}</DialogTitle>
        <Box component="form" onSubmit={saveProduct}>
          <DialogContent sx={{ pt: 1 }}>
            <TextField
              {...setupProfileFieldProps}
              label="Име"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="напр. Консултация"
              sx={outlinedFieldSx}
            />
            <TextField
              {...setupProfileFieldProps}
              type="number"
              label="Цена"
              value={formData.price}
              onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
              inputProps={{ min: 0, step: "0.01" }}
              placeholder="напр. 100.00"
              sx={outlinedFieldSx}
            />
            <TextField
              {...setupProfileFieldProps}
              select
              label="Мерна единица"
              value={formData.unit}
              onChange={(e) => setFormData((prev) => ({ ...prev, unit: e.target.value }))}
              sx={outlinedFieldSx}
            >
              {UNIT_OPTIONS.map((unit) => (
                <MenuItem key={unit} value={unit}>
                  {unit}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              {...setupProfileFieldProps}
              select
              label="ДДС ставка по подразбиране"
              value={formData.vat}
              onChange={(e) => setFormData((prev) => ({ ...prev, vat: Number(e.target.value) }))}
              sx={{ ...outlinedFieldSx, mb: 0 }}
            >
              {VAT_OPTIONS.map((vat) => (
                <MenuItem key={vat} value={vat}>
                  {vat}%
                </MenuItem>
              ))}
            </TextField>
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
