import React from "react";
import { Box, Stack, Typography } from "@mui/material";

export const SectionTitle = ({ icon: Icon, title, subtitle }) => (
  <Stack
    direction="row"
    spacing={1.5}
    alignItems="flex-start"
    sx={{ mb: 2.5, width: "100%", minWidth: 0 }}
  >
    <Box
      sx={{
        mt: 0.25,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 40,
        height: 40,
        borderRadius: 2,
        bgcolor: "var(--color-brand-accent)",
        color: "var(--color-brand-primary)",
      }}
    >
      <Icon fontSize="small" />
    </Box>
    <Box>
      <Typography
        variant="h6"
        component="h2"
        sx={{
          fontWeight: 700,
          fontSize: "1.125rem",
          color: "#0f172a",
          letterSpacing: "-0.02em",
          lineHeight: 1.3,
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.5, fontWeight: 400 }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  </Stack>
);
