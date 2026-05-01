import React, { useEffect, useState } from "react";
import { Alert, Box, Paper, Typography } from "@mui/material";
import {
  query,
  collection,
  where,
  onSnapshot,
  orderBy,
} from "@firebase/firestore";
import { getAuth } from "firebase/auth";
import db from "../firebase";
import Loading from "../components/Loading";
import Table from "../components/Table";
import { tableSurfaceSx } from "../utils/tableStyles";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [vatRate, setVatRate] = useState(20);
  const auth = getAuth();

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return undefined;

    const invoicesQuery = query(
      collection(db, "invoices"),
      where("user_id", "==", uid),
      orderBy("timestamp", "desc"),
    );

    const unsubscribe = onSnapshot(
      invoicesQuery,
      (snapshot) => {
        const rows = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          data: docSnap.data(),
        }));
        setInvoices(rows);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [auth.currentUser?.uid]);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return undefined;

    const businessQuery = query(
      collection(db, "businesses"),
      where("user_id", "==", uid),
    );
    const unsubscribe = onSnapshot(businessQuery, (snap) => {
      if (snap.empty) {
        setVatRate(20);
        return;
      }

      const business = snap.docs[0].data();
      const parsedVat = Number(business.vatRate);
      setVatRate(Number.isFinite(parsedVat) ? parsedVat : 20);
    });

    return () => unsubscribe();
  }, [auth.currentUser?.uid]);

  if (loading) return <Loading />;

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 3 },
        py: { xs: 2, sm: 2.5 },
        maxWidth: 1100,
        mx: "auto",
      }}
    >
      <Typography
        variant="h6"
        component="h1"
        sx={{
          fontWeight: 600,
          color: "var(--color-brand-charcoal)",
          letterSpacing: "-0.02em",
          fontSize: { xs: "1.1rem", sm: "1.2rem" },
          lineHeight: 1.3,
          mb: 0.25,
        }}
      >
        Фактури
      </Typography>

      {invoices.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          Все още няма фактури.
        </Alert>
      ) : null}

      <Paper
        variant="outlined"
        sx={{
          ...tableSurfaceSx,
          maxWidth: "100%",
          p: { xs: 1.5, sm: 2 },
        }}
      >
        <Table invoices={invoices} defaultVatRate={vatRate} />
      </Paper>
    </Box>
  );
};

export default Invoices;
