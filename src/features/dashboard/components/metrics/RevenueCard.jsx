import React from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import { metricPaperSx } from "../styles";

export function RevenueCard({ revenueLabel }) {
  return (
    <Paper elevation={0} sx={metricPaperSx}>
      <Stack direction="row" alignItems="flex-start" spacing={1.5}>
        <Box sx={metricPaperSx.iconGreen}>
          <TrendingUpOutlinedIcon sx={{ fontSize: 20 }} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            Общ приход (месец)
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a", mt: 0.25 }}>
            {revenueLabel}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
            Сбор от издадени фактури за текущия месец
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}
