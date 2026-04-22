import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";

const Customers = () => (
  <Box sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 2.5 }, maxWidth: 560 }}>
    <Typography
      variant="h6"
      component="h1"
      sx={{
        fontWeight: 600,
        color: "var(--color-brand-charcoal)",
        letterSpacing: "-0.02em",
        mb: 0.5,
      }}
    >
      Customers
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
      Manage client records and reuse them on invoices.
    </Typography>
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "var(--color-border-soft)",
        textAlign: "center",
      }}
    >
      <PeopleOutlineOutlinedIcon sx={{ fontSize: 40, color: "var(--color-brand-primary)", mb: 1 }} />
      <Typography variant="subtitle1" fontWeight={600}>
        Coming soon
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Customer directory will be available in a future update.
      </Typography>
    </Paper>
  </Box>
);

export default Customers;
