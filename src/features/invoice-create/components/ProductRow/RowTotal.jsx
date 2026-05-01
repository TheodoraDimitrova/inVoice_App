import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export const RowTotal = ({ currencySign, rowTotal, isEmpty, onDelete }) => (
  <Box
    sx={{
      minWidth: { xs: 120, md: 140 },
      maxWidth: { xs: 170, md: 190 },
      width: "100%",
      minHeight: 24,
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: 0.5,
    }}
  >
    <Typography
      variant="body2"
      sx={{
        flex: 1,
        textAlign: "right",
        whiteSpace: "nowrap",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        fontWeight: 600,
        fontSize: "0.8125rem",
        lineHeight: 1,
        fontVariantNumeric: "tabular-nums",
        color: isEmpty ? "text.disabled" : "text.primary",
      }}
    >
      {currencySign} {rowTotal.toFixed(2)}
    </Typography>
    <IconButton
      size="small"
      color={isEmpty ? "default" : "error"}
      aria-label="Изтрий ред"
      disabled={isEmpty}
      onClick={onDelete}
      sx={{ flexShrink: 0, p: 0.25, alignSelf: "center" }}
    >
      <DeleteOutlineIcon fontSize="small" />
    </IconButton>
  </Box>
);
