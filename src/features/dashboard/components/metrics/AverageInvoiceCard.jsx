import React from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import { metricPaperSx } from "../styles";

export function AverageInvoiceCard({ averageInvoiceLabel }) {
  return (
    <Paper elevation={0} sx={metricPaperSx}>
      <Stack direction="row" alignItems="flex-start" spacing={1.5}>
        <Box sx={metricPaperSx.iconAmber}>
          <ScheduleOutlinedIcon sx={{ fontSize: 20 }} />
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            Средна стойност
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a", mt: 0.25 }}>
            {averageInvoiceLabel}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
            Средна стойност на фактура за месеца
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}
