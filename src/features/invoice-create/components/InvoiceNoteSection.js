import React from "react";
import { Checkbox, FormControlLabel, Paper, Stack, TextField } from "@mui/material";

export const InvoiceNoteSection = ({
  includeInvoiceNote,
  invoiceNote,
  noteError,
  onToggle,
  onChange,
}) => (
  <Paper
    variant="outlined"
    sx={{
      p: { xs: 1, sm: 1.25 },
      borderRadius: 2,
      borderColor: "rgba(15, 23, 42, 0.08)",
      bgcolor: "#fff",
    }}
  >
    <Stack spacing={1}>
      <FormControlLabel
        sx={{
          m: 0,
          "& .MuiFormControlLabel-label": {
            fontSize: "0.95rem",
            fontWeight: 600,
          },
        }}
        control={<Checkbox size="small" checked={Boolean(includeInvoiceNote)} onChange={onToggle} />}
        label="Добави забележка към фактурата"
      />
      {includeInvoiceNote ? (
        <TextField
          size="small"
          fullWidth
          multiline
          minRows={2}
          label="Забележка"
          value={invoiceNote || ""}
          onChange={onChange}
          error={Boolean(noteError)}
          helperText={noteError}
          sx={{
            "& .MuiInputLabel-root": { fontSize: "0.9rem" },
            "& .MuiInputBase-input": { fontSize: "0.95rem" },
            "& .MuiFormHelperText-root": { fontSize: "0.78rem" },
          }}
        />
      ) : null}
    </Stack>
  </Paper>
);
