import React from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import { metricPaperSx } from "../styles";

export function PaymentStatusCard({ paidCount, unpaidCount }) {
  return (
    <Paper elevation={0} sx={metricPaperSx}>
      <Stack direction="row" alignItems="flex-start" spacing={1.5}>
        <Box sx={metricPaperSx.iconMint}>
          <PaidOutlinedIcon sx={{ fontSize: 20 }} />
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            Платени / Неплатени
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a", mt: 0.25 }}>
            {paidCount} / {unpaidCount}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
            По статус на плащане за месеца
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}
