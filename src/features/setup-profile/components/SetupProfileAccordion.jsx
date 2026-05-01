import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const accordionIconBoxSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 40,
  height: 40,
  borderRadius: 2,
  bgcolor: "var(--color-brand-accent)",
  color: "var(--color-brand-primary)",
  flexShrink: 0,
};

const optionalAccordionSx = {
  bgcolor: "transparent",
  boxShadow: "none",
  "&:before": { display: "none" },
};

const setupAccordionWithDividerSx = {
  ...optionalAccordionSx,
  borderTop: "1px solid rgba(15, 23, 42, 0.08)",
};

const accordionHeadingSx = (isOpen) => ({
  fontWeight: isOpen ? 800 : 700,
  fontSize: "1.05rem",
  color: isOpen ? "var(--color-brand-primary)" : "#334155",
});

const SetupProfileAccordion = ({
  panelId,
  openPanels,
  setOpenPanels,
  panelHasError,
  icon,
  title,
  description,
  first = false,
  children,
}) => (
  <Accordion
    expanded={openPanels[panelId]}
    onChange={(_, expanded) =>
      setOpenPanels((prev) => ({ ...prev, [panelId]: expanded }))
    }
    sx={first ? optionalAccordionSx : setupAccordionWithDividerSx}
  >
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
      aria-controls={`setup-${panelId}-content`}
      id={`setup-${panelId}-header`}
      sx={{ px: 1, opacity: 0.92 }}
    >
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <Box sx={accordionIconBoxSx}>{icon}</Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
            <Typography sx={accordionHeadingSx(openPanels[panelId])}>{title}</Typography>
            {panelHasError(panelId) ? (
              <Chip
                label="Поправка"
                size="small"
                color="error"
                variant="outlined"
                sx={{ height: 22 }}
              />
            ) : null}
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            {description}
          </Typography>
        </Box>
      </Stack>
    </AccordionSummary>
    <AccordionDetails sx={{ px: { xs: 1, sm: 2 }, pt: 0, pb: 2 }}>
      {children}
    </AccordionDetails>
  </Accordion>
);

export default SetupProfileAccordion;
