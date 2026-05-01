import React from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { metricPaperSx } from "../styles";

export function InvoicesCard({ issuedCount }) {
  return (
    <Paper elevation={0} sx={metricPaperSx}>
      <Stack direction="row" alignItems="flex-start" spacing={1.5}>
        <Box sx={metricPaperSx.iconBlue}>
          <DescriptionOutlinedIcon sx={{ fontSize: 20 }} />
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            Издадени фактури
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a", mt: 0.25 }}>
            {issuedCount}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
            Брой за текущия месец
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}
