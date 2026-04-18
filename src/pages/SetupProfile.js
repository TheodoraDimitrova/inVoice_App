import React, { useState, useEffect, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { storage } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  onSnapshot,
  query,
  where,
} from "@firebase/firestore";

import db from "../firebase";
import Nav from "../components/Nav";
import Loading from "../components/Loading";
import {
  AddressSection,
  BankSection,
  CompanySection,
  LogoSection,
  TaxSection,
} from "../components/setupProfile";
import { showToast } from "../utils/functions";
import { getAuth } from "firebase/auth";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import { setupProfileSchema } from "../schemas/setupProfileSchema";
import { LOGO_ACCEPT, LOGO_UPLOAD_HINT, validateLogo } from "../utils/validateLogo";

const DEFAULT_LOGO =
  "https://www.pesmcopt.com/admin-media/images/default-logo.png";

const defaultFormValues = {
  businessName: "",
  email: "",
  phone: "",
  businessAddress: "",
  postCode: "",
  city: "",
  country: "",
  vat: "",
  tic: "",
  vatRate: 20,
  bankName: "",
  iban: "",
  swift: "",
};

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

const SetupProfile = () => {
  const auth = getAuth();
  const [logo, setLogo] = useState(DEFAULT_LOGO);
  const [logoFileName, setLogoFileName] = useState("");
  const [logoDragActive, setLogoDragActive] = useState(false);
  const logoInputRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const form = useForm({
    resolver: zodResolver(setupProfileSchema),
    defaultValues: defaultFormValues,
    mode: "onSubmit",
  });

  const { handleSubmit, formState: { isSubmitting } } = form;

  const hasCustomLogo = logo !== DEFAULT_LOGO;

  useEffect(() => {
    try {
      const q = query(
        collection(db, "businesses"),
        where("user_id", "==", auth.currentUser.uid)
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const business = [];
        querySnapshot.forEach((d) => {
          business.push(d.data());
        });
        setLoading(false);

        if (business.length > 0) {
          navigate("/dashboard");
        }
      });
      return () => unsubscribe();
    } catch (error) {
      console.log(error);
    }
  }, [auth.currentUser.uid, navigate]);

  const applyLogoFile = useCallback((file) => {
    const check = validateLogo(file);
    if (!check.ok) {
      showToast("error", check.message);
      return;
    }
    setLogoFileName(file.name);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (readerEvent) => {
      setLogo(readerEvent.target.result);
    };
  }, []);

  const handleFileReader = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    applyLogoFile(file);
    e.target.value = "";
  };

  const handleLogoDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLogoDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) applyLogoFile(file);
  };

  const handleLogoDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLogoDragActive(true);
  };

  const handleLogoDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLogoDragActive(false);
  };

  const clearLogo = () => {
    setLogo(DEFAULT_LOGO);
    setLogoFileName("");
    if (logoInputRef.current) logoInputRef.current.value = "";
  };

  const onSubmit = async (data) => {
    try {
      const docRef = await addDoc(collection(db, "businesses"), {
        user_id: auth.currentUser.uid,
        vatRate: Number(data.vatRate) || 0,
        businessName: data.businessName,
        businessAddress: data.businessAddress,
        postCode: data.postCode,
        city: data.city,
        country: data.country,
        businessCity: `${data.postCode} ${data.city}, ${data.country}`,
        phone: data.phone,
        tic: data.tic,
        vat: data.vat,
        email: data.email,
        iban: data.iban,
        swift: data.swift,
        bankName: data.bankName,
        invoices: 0,
      });

      const imageRef = ref(storage, `businesses/${docRef.id}/image`);
      const metadata = {
        customMetadata: {
          owner: auth.currentUser.uid,
        },
      };

      if (logo !== DEFAULT_LOGO) {
        await uploadString(imageRef, logo, "data_url", metadata);
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "businesses", docRef.id), {
          logo: downloadURL,
        });
        showToast("success", "Your business profile is ready.");
      } else {
        showToast(
          "success",
          "Profile saved. You can add a logo later from settings when available."
        );
      }
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      showToast("error", "Could not save profile. Please try again.");
    }
  };

  const submitForm = () => handleSubmit(onSubmit)();

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Box
          sx={{
            minHeight: "100vh",
            bgcolor: "#f8fafc",
            backgroundImage:
              "linear-gradient(180deg, #e6faf1 0%, #f8fafc 42%, #f8fafc 100%)",
            pb: 6,
          }}
        >
          <Nav />
          <Container maxWidth="lg" sx={{ pt: { xs: 3, sm: 4 }, px: { xs: 2, sm: 3 } }}>
            <Typography
              variant="overline"
              sx={{
                display: "block",
                textAlign: "center",
                color: "primary.main",
                fontWeight: 600,
                letterSpacing: "0.12em",
                mb: 1,
              }}
            >
              One last step
            </Typography>
            <Typography
              variant="h4"
              component="h1"
              align="center"
              sx={{
                fontWeight: 600,
                color: "var(--color-brand-charcoal)",
                letterSpacing: "-0.03em",
                mb: 1,
              }}
            >
              Set up your business
            </Typography>
            <Typography
              variant="body1"
              align="center"
              color="text.secondary"
              sx={{ maxWidth: 560, mx: "auto", mb: 4 }}
            >
              Add your company name, contact details, and address to get started. Tax, bank
              details, and logo are optional and can be completed later.
            </Typography>

            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                border: "1px solid",
                borderColor: "var(--color-border-soft)",
                boxShadow:
                  "0 4px 24px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04)",
                overflow: "hidden",
              }}
            >
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit(onSubmit)}
                sx={{ px: { xs: 2, sm: 3, md: 4 }, py: { xs: 3, sm: 4 } }}
              >
                <Grid container spacing={3} sx={{ alignItems: "stretch" }}>
                  <Grid item xs={12} md={8} order={{ xs: 1, md: 1 }}>
                    <CompanySection form={form} />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={4}
                    order={{ xs: 3, md: 2 }}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      minWidth: 0,
                    }}
                  >
                    <LogoSection
                      logo={logo}
                      logoFileName={logoFileName}
                      logoDragActive={logoDragActive}
                      logoInputRef={logoInputRef}
                      hasCustomLogo={hasCustomLogo}
                      onFileChange={handleFileReader}
                      onDrop={handleLogoDrop}
                      onDragOver={handleLogoDragOver}
                      onDragLeave={handleLogoDragLeave}
                      onClear={clearLogo}
                      onChooseClick={() => logoInputRef.current?.click()}
                      uploadHint={LOGO_UPLOAD_HINT}
                      accept={LOGO_ACCEPT}
                      compact
                    />
                  </Grid>
                  <Grid item xs={12} order={{ xs: 2, md: 3 }}>
                    <AddressSection form={form} />
                  </Grid>
                </Grid>

                <Stack alignItems="center" spacing={0.5} sx={{ mt: 3, mb: 2 }}>
                  <Button
                    type="button"
                    variant="text"
                    color="inherit"
                    onClick={submitForm}
                    sx={{
                      textTransform: "none",
                      color: "text.secondary",
                      fontWeight: 500,
                    }}
                  >
                    Skip optional details for now
                  </Button>
                  <Typography variant="caption" color="text.secondary" textAlign="center">
                    Saves your company and address if valid, then opens the dashboard.
                  </Typography>
                </Stack>

                <Box
                  sx={{
                    mt: 2,
                    p: { xs: 1.5, sm: 2 },
                    borderRadius: 2,
                    bgcolor: "rgba(15, 23, 42, 0.04)",
                    border: "1px solid",
                    borderColor: "rgba(15, 23, 42, 0.08)",
                  }}
                >
                  <Accordion defaultExpanded={false} sx={optionalAccordionSx}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="setup-tax-content"
                      id="setup-tax-header"
                      sx={{ px: 1, opacity: 0.92 }}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="flex-start">
                        <Box sx={accordionIconBoxSx}>
                          <GavelOutlinedIcon fontSize="small" />
                        </Box>
                        <Box>
                          <Typography sx={{ fontWeight: 700, fontSize: "1.05rem", color: "#334155" }}>
                            Tax & registration (Optional)
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                            Shown on PDF invoices when applicable.
                          </Typography>
                        </Box>
                      </Stack>
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: { xs: 1, sm: 2 }, pt: 0, pb: 2 }}>
                      <TaxSection form={form} showTitle={false} />
                    </AccordionDetails>
                  </Accordion>

                  <Accordion
                    defaultExpanded={false}
                    sx={{
                      ...optionalAccordionSx,
                      borderTop: "1px solid rgba(15, 23, 42, 0.08)",
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="setup-bank-content"
                      id="setup-bank-header"
                      sx={{ px: 1, opacity: 0.92 }}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="flex-start">
                        <Box sx={accordionIconBoxSx}>
                          <AccountBalanceOutlinedIcon fontSize="small" />
                        </Box>
                        <Box>
                          <Typography sx={{ fontWeight: 700, fontSize: "1.05rem", color: "#334155" }}>
                            Bank details (Optional)
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                            Payment instructions on your invoices.
                          </Typography>
                        </Box>
                      </Stack>
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: { xs: 1, sm: 2 }, pt: 0, pb: 2 }}>
                      <BankSection form={form} showTitle={false} />
                    </AccordionDetails>
                  </Accordion>
                </Box>

                <Stack spacing={2} sx={{ mt: 4 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={isSubmitting}
                    sx={{
                      py: 1.35,
                      fontWeight: 600,
                      boxShadow:
                        "0 4px 20px rgba(15, 118, 110, 0.12), 0 2px 8px rgba(15, 23, 42, 0.06)",
                    }}
                  >
                    {isSubmitting
                      ? "Saving…"
                      : "Complete setup later and go to dashboard"}
                  </Button>
                  <Typography variant="caption" color="text.secondary" textAlign="center">
                    You can update tax, bank, and logo anytime from your account when editing is
                    available.
                  </Typography>
                </Stack>
              </Box>
            </Paper>
          </Container>
        </Box>
      )}
    </>
  );
};

export default SetupProfile;
