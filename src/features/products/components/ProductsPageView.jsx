import React from "react";
import {
  Box,
  Button,
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
import { dataTableSx, numericCellSx, tableSurfaceSx } from "../../../utils/tableStyles";

const ProductsPageView = ({
  sortedProducts,
  onOpenAddDialog,
  onOpenEditDialog,
  onDeleteProduct,
}) => (
  <Box
    sx={{
      px: { xs: 2, sm: 3 },
      py: { xs: 2, sm: 2.5 },
      maxWidth: 1100,
      mx: "auto",
    }}
  >
    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2.5 }}>
      <Typography variant="h6" component="h1" sx={{ fontWeight: 700, color: "var(--color-brand-charcoal)" }}>
        Продукти или услуги
      </Typography>
      <Button variant="contained" startIcon={<AddIcon />} onClick={onOpenAddDialog}>
        Добави продукт
      </Button>
    </Stack>

    {sortedProducts.length > 0 ? (
      <TableContainer component={Paper} variant="outlined" sx={{ ...tableSurfaceSx, maxWidth: "100%", overflowX: "auto" }}>
        <Table size="small" sx={{ ...dataTableSx, minWidth: 720 }}>
          <TableHead sx={{ backgroundColor: "#f8fafc" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, width: "40%" }}>Име</TableCell>
              <TableCell sx={{ fontWeight: 700, textAlign: "right", pr: 4 }}>Кол-во</TableCell>
              <TableCell sx={{ fontWeight: 700, textAlign: "left", width: "80px" }}>Мярка</TableCell>
              <TableCell sx={{ fontWeight: 700, textAlign: "right", width: "200px", pr: "40px" }}>
                НЕТНА ЦЕНА (БЕЗ ДДС)
              </TableCell>
              <TableCell className="table-actions-cell" sx={{ fontWeight: 700, textAlign: "center", width: "120px" }}>
                Действия
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedProducts.map((product) => (
              <TableRow key={product.id} hover>
                <TableCell sx={{ maxWidth: 200, whiteSpace: "normal", wordBreak: "break-word", color: "#1A1A1A", fontWeight: 600 }}>
                  {product.name}
                </TableCell>
                <TableCell className="table-number-cell" sx={{ ...numericCellSx, color: "#6B7280" }}>
                  {Number(product.quantityDefault || 1).toFixed(2)}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap", color: "#6B7280" }}>{product.unit}</TableCell>
                <TableCell className="table-number-cell" sx={{ ...numericCellSx, color: "#6B7280" }}>
                  {Number(product.price).toFixed(2)} EUR
                </TableCell>
                <TableCell className="table-actions-cell">
                  <Box className="table-actions-wrap">
                    <IconButton size="small" onClick={() => onOpenEditDialog(product)} aria-label="Редакция на продукт">
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => onDeleteProduct(product.id)} aria-label="Изтрий продукт">
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
        <Inventory2OutlinedIcon sx={{ fontSize: 48, color: "var(--color-brand-primary)", mb: 1 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
          Нямате добавени продукти
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Спестете време при фактуриране! Добавете първия си продукт и той ще се попълва автоматично.
        </Typography>
      </Paper>
    )}

  </Box>
);

export default ProductsPageView;
