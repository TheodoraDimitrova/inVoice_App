export const tableSurfaceSx = {
  borderRadius: 2.5,
  borderColor: "rgba(148, 163, 184, 0.32)",
  boxShadow: "0 10px 28px rgba(15, 23, 42, 0.08)",
  overflow: "hidden",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)",
};

export const dataTableSx = {
  "& .MuiTableCell-root": {
    px: { xs: 1.25, sm: 1.5 },
    py: 1.15,
    borderBottomColor: "rgba(148, 163, 184, 0.22)",
    textAlign: "left",
  },
  "& .MuiTableHead-root .MuiTableRow-root": {
    background:
      "linear-gradient(180deg, rgba(248,250,252,0.95) 0%, rgba(241,245,249,0.95) 100%)",
  },
  "& .MuiTableHead-root .MuiTableCell-root": {
    fontWeight: 700,
    fontSize: "0.72rem",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "#475569",
    borderBottomColor: "rgba(100, 116, 139, 0.26)",
  },
  "& .MuiTableBody-root .MuiTableRow-root": {
    transition: "background-color 0.2s ease",
  },
  "& .MuiTableBody-root .MuiTableRow-root .MuiTableCell-root:first-of-type": {
    boxShadow: "inset 0 0 0 0 var(--color-brand-primary)",
    transition: "box-shadow 0.2s ease",
  },
  "& .MuiTableBody-root .MuiTableRow-root:hover": {
    backgroundColor: "rgba(16, 185, 129, 0.06)",
  },
  "& .MuiTableBody-root .MuiTableRow-root:hover .MuiTableCell-root:first-of-type": {
    boxShadow: "inset 2px 0 0 0 var(--color-brand-primary)",
  },
  "& .table-number-cell": {
    textAlign: "right",
    fontFamily:
      '"Roboto Mono", "SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontVariantNumeric: "tabular-nums lining-nums",
    letterSpacing: "0.01em",
  },
  "& .table-actions-cell": {
    width: 122,
    whiteSpace: "nowrap",
    textAlign: "right",
  },
  "& .table-actions-wrap": {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 0.25,
  },
};

export const numericCellSx = {
  textAlign: "right",
  fontFamily:
    '"Roboto Mono", "SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  fontVariantNumeric: "tabular-nums lining-nums",
  letterSpacing: "0.01em",
};
