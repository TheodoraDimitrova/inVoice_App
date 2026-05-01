import React from "react";
import DashboardActionsSvg from "./DashboardActionsSvg";
import { convertTimestamp } from "../utils/functions";
import {
  Box,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { dataTableSx, numericCellSx } from "../utils/tableStyles";
import { computeInvoiceGrandTotalNumber } from "../utils/invoiceMetrics";

const formatInvoiceBadge = (invoiceData) => {
  const n = Number(invoiceData?.id);
  const hasNumber = Number.isFinite(n) && n > 0;
  if (!hasNumber || invoiceData?.status === "draft") return "Чернова";
  return String(n).padStart(10, "0");
};

const Table = ({ invoices, defaultVatRate = 0 }) => {
  if (!Array.isArray(invoices) || invoices.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
        Няма налични фактури.
      </Typography>
    );
  }

  return (
    <Box sx={{ overflowX: "auto" }}>
      <MuiTable size="small" sx={{ ...dataTableSx, minWidth: 560 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Дата</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Клиент</TableCell>
            <TableCell className="table-number-cell" sx={{ ...numericCellSx, fontWeight: 700 }}>
              Сума
            </TableCell>
            <TableCell className="table-actions-cell" sx={{ fontWeight: 700, textAlign: "right" }}>
              Действия
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoices.map((invoice) => {
            const invoiceData = invoice.data || {};
            const rowCurrency = String(invoiceData.currency || "EUR").toUpperCase();
            const rowVatRate = Number(invoiceData.vatRate);
            const computedTotal = computeInvoiceGrandTotalNumber(
              invoiceData.itemList,
              Number.isFinite(rowVatRate) ? rowVatRate : defaultVatRate
            );

            return (
              <TableRow key={invoice.id} hover>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  <Box
                    sx={{
                      display: "inline-flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: 0.35,
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        color: "#111827",
                        fontWeight: 600,
                        fontSize: "0.87rem",
                        lineHeight: 1.28,
                      }}
                    >
                      {convertTimestamp(invoiceData.timestamp)}
                    </Box>
                    <Box
                      component="span"
                      sx={{
                        ...numericCellSx,
                        display: "block",
                        color: "#4B5563",
                        fontSize: "0.79rem",
                        fontWeight: 500,
                        lineHeight: 1.22,
                      }}
                    >
                      № {formatInvoiceBadge(invoiceData)}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap", color: "#1A1A1A", fontWeight: 600 }}>
                  {invoiceData.customerName || "—"}
                </TableCell>
                <TableCell className="table-number-cell" sx={{ ...numericCellSx, color: "#6B7280" }}>
                  {computedTotal.toFixed(2)} {rowCurrency}
                </TableCell>
                <TableCell className="table-actions-cell">
                  <Box className="table-actions-wrap">
                    <DashboardActionsSvg invoiceId={invoice.id} />
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </MuiTable>
    </Box>
  );
};

export default Table;
