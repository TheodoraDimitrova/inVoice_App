import React, { useEffect, useState, useMemo } from "react";
import Table from "../components/Table";
import { useLocation, useNavigate } from "react-router-dom";
import {
  query,
  collection,
  where,
  onSnapshot,
  orderBy,
} from "@firebase/firestore";
import db from "../firebase";
import Loading from "../components/Loading";
import { getAuth } from "firebase/auth";
import {
  Alert,
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import HourglassEmptyOutlinedIcon from "@mui/icons-material/HourglassEmptyOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { getCountryCommercialDefaults } from "../data/countryCommercialRules";
import { aggregateDashboardMetrics } from "../utils/invoiceMetrics";
import { useInvoiceCreationReady } from "../contexts/InvoiceCreationReadyContext";
import { tableSurfaceSx } from "../utils/tableStyles";

const metricPaperSx = {
  borderRadius: 2,
  border: "1px solid",
  borderColor: "var(--color-border-soft)",
  boxShadow: "0 1px 3px rgba(15, 23, 42, 0.06)",
  p: 2,
  height: "100%",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isInvoicesRoute = location.pathname === "/invoices";

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [businessName, setBusinessName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [vatRate, setVatRate] = useState(20);
  const [businessCurrency, setBusinessCurrency] = useState("EUR");
  const auth = getAuth();
  const { loading: invoiceGateLoading, ready: canCreateInvoice } = useInvoiceCreationReady();

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return undefined;

    const q = query(
      collection(db, "invoices"),
      where("user_id", "==", uid),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const firebaseInvoices = [];
        querySnapshot.forEach((docSnap) => {
          firebaseInvoices.push({ data: docSnap.data(), id: docSnap.id });
        });
        setInvoices(firebaseInvoices);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [auth.currentUser?.uid]);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return undefined;

    const q = query(collection(db, "businesses"), where("user_id", "==", uid));
    const unsubscribe = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const d = snap.docs[0].data();
        setBusinessName(typeof d.businessName === "string" ? d.businessName.trim() : "");
        setCompanyEmail(typeof d.email === "string" ? d.email.trim() : "");
        const vr = Number(d.vatRate);
        setVatRate(Number.isNaN(vr) ? 20 : vr);
        const stored =
          typeof d.currency === "string" && d.currency.trim() ? d.currency.trim() : "";
        const country = typeof d.country === "string" ? d.country : "";
        setBusinessCurrency(stored || getCountryCommercialDefaults(country).currency);
      } else {
        setBusinessName("");
        setCompanyEmail("");
        setVatRate(20);
        setBusinessCurrency("EUR");
      }
    });
    return () => unsubscribe();
  }, [auth.currentUser?.uid]);

  const metrics = useMemo(
    () => aggregateDashboardMetrics(invoices, vatRate),
    [invoices, vatRate]
  );

  const revenueLabel = `${businessCurrency || metrics.currency} ${metrics.totalRevenue.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Box sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 2.5 }, maxWidth: 1100, mx: "auto" }}>
          {!invoiceGateLoading && !canCreateInvoice ? (
            <Alert
              severity="warning"
              sx={{ mb: 2.5, alignItems: "center" }}
              action={
                <Button color="inherit" size="small" onClick={() => navigate("/profile")}>
                  Настройки на профила
                </Button>
              }
            >
              За да създавате фактури, добавете{" "}
              <strong>данъчни настройки</strong> (ДДС),{" "}
              <strong>фирмен идентификатор</strong> и{" "}
              <strong>банкови данни</strong> в „Профил“, или включете опцията{" "}
              <strong>"Не ми трябват банкови данни във фактурите"</strong>.
              Данните за фирма и адрес са достатъчни за достъп до таблото.
            </Alert>
          ) : null}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "stretch", sm: "center" }}
            justifyContent="space-between"
            spacing={2}
            sx={{ mb: 2.5 }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="h6"
                component="h1"
                sx={{
                  fontWeight: 600,
                  color: "var(--color-brand-charcoal)",
                  letterSpacing: "-0.02em",
                  fontSize: { xs: "1.1rem", sm: "1.2rem" },
                  lineHeight: 1.3,
                }}
              >
                {isInvoicesRoute ? "Фактури" : "Табло"}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                {isInvoicesRoute
                  ? "Издадени фактури и бързи действия."
                  : businessName
                    ? businessName
                    : "Преглед и последна активност."}
              </Typography>
              {companyEmail ? (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.75, display: "block" }}>
                  Фирмен имейл: {companyEmail}
                </Typography>
              ) : null}
            </Box>
            <Stack direction="row" spacing={1} justifyContent="flex-end" flexShrink={0}>
              <Button
                type="button"
                variant="outlined"
                color="primary"
                size="small"
                startIcon={<Inventory2OutlinedIcon sx={{ fontSize: 18 }} />}
                onClick={() => navigate("/products")}
                sx={{
                  minHeight: 40,
                  textTransform: "none",
                  fontWeight: 600,
                  borderColor: "var(--color-brand-primary)",
                  color: "var(--color-brand-primary)",
                }}
              >
                Продукти
              </Button>
            </Stack>
          </Stack>

          {!isInvoicesRoute && (
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={4}>
                <Paper elevation={0} sx={metricPaperSx}>
                  <Stack direction="row" alignItems="flex-start" spacing={1.5}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 1.5,
                        bgcolor: "var(--color-brand-accent)",
                        color: "var(--color-brand-primary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <TrendingUpOutlinedIcon sx={{ fontSize: 20 }} />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        Общи приходи
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a", mt: 0.25 }}>
                        {revenueLabel}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                        Сбор от крайните суми по фактури (с ДДС)
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper elevation={0} sx={metricPaperSx}>
                  <Stack direction="row" alignItems="flex-start" spacing={1.5}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 1.5,
                        bgcolor: "rgba(251, 191, 36, 0.15)",
                        color: "#b45309",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <HourglassEmptyOutlinedIcon sx={{ fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        Чакащи
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a", mt: 0.25 }}>
                        {metrics.pendingCount}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                        Обновявайте статуса на плащане за проследяване
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper elevation={0} sx={metricPaperSx}>
                  <Stack direction="row" alignItems="flex-start" spacing={1.5}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 1.5,
                        bgcolor: "rgba(99, 102, 241, 0.12)",
                        color: "#4f46e5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <DescriptionOutlinedIcon sx={{ fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        Чернови
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a", mt: 0.25 }}>
                        {metrics.draftsCount}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                        Брой фактури в чернова
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          )}

          <Paper
            variant="outlined"
            sx={{
              ...tableSurfaceSx,
              maxWidth: "100%",
              p: { xs: 1.5, sm: 2 },
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "0.95rem",
                color: "#334155",
                mb: 1,
              }}
            >
              Последни фактури
            </Typography>
            <Table invoices={invoices} defaultVatRate={vatRate} />
          </Paper>
        </Box>
      )}
    </>
  );
};

export default Dashboard;
