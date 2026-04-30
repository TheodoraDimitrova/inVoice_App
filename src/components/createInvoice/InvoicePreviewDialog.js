import React from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

export const InvoicePreviewDialog = ({ open, onClose, children }) => (
  <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
    <DialogTitle>Преглед на фактура</DialogTitle>
    <DialogContent sx={{ pt: 1 }}>
      <Box
        sx={{
          maxHeight: "72vh",
          overflow: "auto",
          bgcolor: "#f8fafc",
          borderRadius: 1.5,
          p: { xs: 0.5, sm: 1 },
        }}
      >
        {children}
      </Box>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2.5, pt: 0.5, gap: 1 }}>
      <Button onClick={onClose}>Затвори</Button>
    </DialogActions>
  </Dialog>
);
