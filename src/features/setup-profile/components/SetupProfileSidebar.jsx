import React from "react";
import { Paper, Typography } from "@mui/material";

const SetupProfileSidebar = () => (
  <Paper
    elevation={0}
    sx={{
      p: 2.5,
      borderRadius: 3,
      border: "1px solid",
      borderColor: "var(--color-border-soft)",
      bgcolor: "rgba(15, 118, 110, 0.04)",
      position: { lg: "sticky" },
      top: { lg: 24 },
      boxShadow: "0 2px 12px rgba(15, 23, 42, 0.04)",
    }}
  >
    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: "#0f172a" }}>
      Съвети
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.55 }}>
      <strong>Задължителни данни:</strong>
      <br />
      Фирма, адрес и <strong>ЕИК / BULSTAT</strong>.
      <br />
      ДДС номер се изисква само ако сте регистрирани по ДДС.
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.55 }}>
      <strong>По избор:</strong>
      <br />
      Телефон, лого и банкови данни.
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.55 }}>
      <strong>Банкови данни:</strong>
      <br />
      Ако ги добавите, попълнете име на банка, IBAN и SWIFT/BIC. Можете да
      изберете опцията без банкови данни.
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.55 }}>
      <strong>Фактури:</strong>
      <br />
      След попълване на основните данни ще можете да създавате фактури.
    </Typography>
    <Typography variant="caption" color="text.secondary" sx={{ display: "block", lineHeight: 1.5 }}>
      <strong>Съвет:</strong>
      <br />
      Печат и подпис не са задължителни – фактурата е валидна и без тях.
    </Typography>
  </Paper>
);

export default SetupProfileSidebar;
