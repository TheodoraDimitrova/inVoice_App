import React from "react";
import {
  Box,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { dataTableSx, numericCellSx } from "../../../utils/tableStyles";

const HEAD_SX = {
  fontSize: "0.72rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "#475569",
};

const COL = {
  name: { width: "38%" },
  qty: { width: "10%", ...numericCellSx },
  unit: { width: "10%" },
  price: { width: "24%", ...numericCellSx },
  actions: { width: "118px", whiteSpace: "nowrap", textAlign: "right" },
};

const inlineSx = {
  "& .MuiOutlinedInput-root": {
    fontSize: "0.8rem",
    bgcolor: "#fff",
    borderRadius: 1,
  },
  "& .MuiOutlinedInput-input": { py: "5px", px: "7px" },
  "& input[type=number]": { MozAppearance: "textfield" },
  "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
    { WebkitAppearance: "none", margin: 0 },
};

const inlineNumericSx = {
  ...inlineSx,
  "& .MuiOutlinedInput-input": {
    py: "5px",
    px: "7px",
    textAlign: "right",
    fontVariantNumeric: "tabular-nums",
  },
};

const ProductsTable = ({
  sortedProducts,
  editingId,
  editData,
  inlineSaving,
  inlineErrors,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onUpdateField,
  onDeleteRequest,
}) => (
  <TableContainer
    component={Paper}
    variant="outlined"
    sx={{ maxWidth: "100%", overflowX: "auto" }}
  >
    <Table
      size="small"
      sx={{ ...dataTableSx, minWidth: 620, tableLayout: "fixed" }}
    >
      <TableHead>
        <TableRow>
          <TableCell sx={{ ...HEAD_SX, ...COL.name }}>Наименование</TableCell>
          <TableCell sx={{ ...HEAD_SX, ...COL.qty }}>Кол-во</TableCell>
          <TableCell sx={{ ...HEAD_SX, ...COL.unit }}>Мярка</TableCell>
          <TableCell sx={{ ...HEAD_SX, ...COL.price }}>Нетна цена</TableCell>
          <TableCell sx={{ ...HEAD_SX, ...COL.actions }}>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              Действия
            </Box>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sortedProducts.map((product) => {
          const isEditing = editingId === product.id;

          if (isEditing && editData) {
            return (
              <TableRow
                key={product.id}
                sx={{ bgcolor: "rgba(16,185,129,0.04)" }}
              >
                <TableCell sx={COL.name}>
                  <TextField
                    autoFocus
                    size="small"
                    fullWidth
                    placeholder="Наименование"
                    value={editData.name}
                    onChange={(e) => onUpdateField("name", e.target.value)}
                    error={Boolean(inlineErrors.name)}
                    title={inlineErrors.name || ""}
                    sx={inlineSx}
                    disabled={inlineSaving}
                  />
                </TableCell>
                <TableCell sx={COL.qty}>
                  <TextField
                    size="small"
                    type="number"
                    fullWidth
                    placeholder="1"
                    value={editData.itemQuantity}
                    onChange={(e) =>
                      onUpdateField("itemQuantity", e.target.value)
                    }
                    error={Boolean(inlineErrors.itemQuantity)}
                    title={inlineErrors.itemQuantity || ""}
                    inputProps={{ min: 0.01, step: "0.01" }}
                    sx={inlineNumericSx}
                    disabled={inlineSaving}
                  />
                </TableCell>
                <TableCell sx={COL.unit}>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="бр."
                    value={editData.itemUnit}
                    onChange={(e) => onUpdateField("itemUnit", e.target.value)}
                    error={Boolean(inlineErrors.itemUnit)}
                    title={inlineErrors.itemUnit || ""}
                    sx={inlineSx}
                    disabled={inlineSaving}
                  />
                </TableCell>
                <TableCell sx={COL.price}>
                  <TextField
                    size="small"
                    type="number"
                    fullWidth
                    placeholder="0.00"
                    value={editData.priceNet}
                    onChange={(e) => onUpdateField("priceNet", e.target.value)}
                    error={Boolean(inlineErrors.priceNet)}
                    title={inlineErrors.priceNet || ""}
                    inputProps={{ min: 0.01, step: "0.01" }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          sx={{
                            "& p": { fontSize: "0.75rem", color: "#9CA3AF" },
                          }}
                        >
                          EUR
                        </InputAdornment>
                      ),
                    }}
                    sx={inlineNumericSx}
                    disabled={inlineSaving}
                  />
                </TableCell>
                <TableCell sx={COL.actions}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 0.5,
                    }}
                  >
                    <Tooltip title="Запази">
                      <span>
                        <IconButton
                          size="small"
                          onClick={onSaveEdit}
                          disabled={inlineSaving}
                          sx={{
                            color: "var(--color-brand-primary)",
                            "&:hover": { bgcolor: "rgba(16,185,129,0.1)" },
                          }}
                        >
                          <CheckIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Откажи">
                      <span>
                        <IconButton
                          size="small"
                          onClick={onCancelEdit}
                          disabled={inlineSaving}
                          sx={{
                            color: "#9CA3AF",
                            "&:hover": {
                              color: "#374151",
                              bgcolor: "rgba(15,23,42,0.06)",
                            },
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            );
          }

          return (
            <TableRow
              key={product.id}
              hover
              sx={{ opacity: editingId && !isEditing ? 0.45 : 1 }}
            >
              <TableCell
                sx={{
                  ...COL.name,
                  color: "#111827",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                <Tooltip
                  title={product.name}
                  placement="top-start"
                  enterDelay={600}
                >
                  <span>{product.name}</span>
                </Tooltip>
              </TableCell>
              <TableCell sx={{ ...COL.qty, color: "#374151" }}>
                {Number(product.quantityDefault || 1).toFixed(2)}
              </TableCell>
              <TableCell
                sx={{ ...COL.unit, color: "#6B7280", whiteSpace: "nowrap" }}
              >
                {product.unit}
              </TableCell>
              <TableCell sx={{ ...COL.price, color: "#374151" }}>
                {Number(product.price).toFixed(2)}
                <Typography
                  component="span"
                  sx={{ color: "#9CA3AF", ml: 0.5, fontSize: "0.75rem" }}
                >
                  EUR
                </Typography>
              </TableCell>
              <TableCell sx={COL.actions}>
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}
                >
                  <Tooltip title="Редактирай">
                    <span>
                      <IconButton
                        size="small"
                        onClick={() => onStartEdit(product)}
                        disabled={Boolean(editingId)}
                        aria-label="Редакция на продукт"
                        sx={{
                          color: "#475569",
                          "&:hover": {
                            color: "var(--color-brand-primary)",
                            bgcolor: "rgba(16,185,129,0.08)",
                          },
                        }}
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title="Изтрий">
                    <span>
                      <IconButton
                        size="small"
                        onClick={() => onDeleteRequest(product.id)}
                        disabled={Boolean(editingId)}
                        aria-label="Изтрий продукт"
                        sx={{
                          color: "#9CA3AF",
                          "&:hover": {
                            color: "error.main",
                            bgcolor: "rgba(239,68,68,0.08)",
                          },
                        }}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  </TableContainer>
);

export default ProductsTable;
