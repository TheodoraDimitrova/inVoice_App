import React, { useState, useEffect, useRef, useCallback } from "react";
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
import { showToast } from "../utils/functions";
import { getAuth } from "firebase/auth";
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { outlinedFieldSx } from "../utils/muiFieldSx";

const DEFAULT_LOGO =
  "https://www.pesmcopt.com/admin-media/images/default-logo.png";

const fieldProps = {
  fullWidth: true,
  variant: "outlined",
  size: "medium",
};

const SetupProfile = () => {
  const auth = getAuth();
  const [businessName, setBusinessName] = useState("");
  const [vatRate, setVatRate] = useState(20);
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessCity, setBusinessCity] = useState("");
  const [tic, setTic] = useState("");
  const [vat, setVat] = useState("");
  const [bankName, setBankName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [bankNo, setBankNo] = useState("");
  const [iban, setIban] = useState("");
  const [swift, setSwift] = useState("");
  const [logo, setLogo] = useState(DEFAULT_LOGO);
  const [logoFileName, setLogoFileName] = useState("");
  const [logoDragActive, setLogoDragActive] = useState(false);
  const logoInputRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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
    if (!file || !file.type.startsWith("image/")) {
      showToast("error", "Please choose a PNG or JPG image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast("error", "Image must be under 5 MB.");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bn = businessName.trim();
    const em = email.trim();
    const ph = phone.trim();
    const ba = businessAddress.trim();
    const bc = businessCity.trim();

    if (!bn || !em || !ph || !ba || !bc) {
      showToast("error", "Please fill in all required fields marked with *.");
      return;
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em);
    if (!emailOk) {
      showToast("error", "Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    try {
      const docRef = await addDoc(collection(db, "businesses"), {
        user_id: auth.currentUser.uid,
        vatRate: Number(vatRate) || 0,
        businessName: bn,
        businessAddress: ba,
        businessCity: bc,
        phone: ph,
        tic,
        vat,
        email: em,
        iban,
        swift,
        bankNo,
        bankName,
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
    } finally {
      setSubmitting(false);
    }
  };

  const SectionTitle = ({ icon: Icon, title, subtitle }) => (
    <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ mb: 2.5 }}>
      <Box
        sx={{
          mt: 0.25,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 40,
          height: 40,
          borderRadius: 2,
          bgcolor: "var(--color-brand-accent)",
          color: "var(--color-brand-primary)",
        }}
      >
        <Icon fontSize="small" />
      </Box>
      <Box>
        <Typography
          variant="h6"
          component="h2"
          sx={{
            fontWeight: 600,
            color: "var(--color-brand-charcoal)",
            letterSpacing: "-0.02em",
            lineHeight: 1.3,
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
    </Stack>
  );

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
          <Container maxWidth="md" sx={{ pt: { xs: 3, sm: 4 }, px: { xs: 2, sm: 3 } }}>
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
              sx={{ maxWidth: 520, mx: "auto", mb: 4 }}
            >
              These details appear on your invoices. You can refine them later;
              get the essentials in now so your first invoice looks professional.
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
                sx={{
                  px: { xs: 2, sm: 3, md: 4 },
                  py: { xs: 2.5, sm: 3 },
                  borderBottom: "1px solid",
                  borderColor: "var(--color-border-soft)",
                  bgcolor: "rgba(255,255,255,0.7)",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Fields marked with <Box component="span" color="error.main">*</Box> are required to
                  create your profile.
                </Typography>
              </Box>

              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ px: { xs: 2, sm: 3, md: 4 }, py: { xs: 3, sm: 4 } }}
              >
                <SectionTitle
                  icon={BusinessOutlinedIcon}
                  title="Company & contact"
                  subtitle="How clients reach you and where you operate."
                />
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      {...fieldProps}
                      required
                      label="Company name"
                      name="businessName"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      sx={{
                        ...outlinedFieldSx,
                        mb: 0,
                        "& .MuiInputBase-input": {
                          py: 1.5,
                          textTransform: "capitalize",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      {...fieldProps}
                      required
                      label="Company email"
                      type="email"
                      name="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      sx={{ ...outlinedFieldSx, mb: 0 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      {...fieldProps}
                      required
                      label="Phone"
                      type="tel"
                      name="phone"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      sx={{ ...outlinedFieldSx, mb: 0 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      {...fieldProps}
                      required
                      label="Street address"
                      name="businessAddress"
                      value={businessAddress}
                      onChange={(e) => setBusinessAddress(e.target.value)}
                      helperText="Street, number, district"
                      sx={{ ...outlinedFieldSx, mb: 0 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      {...fieldProps}
                      required
                      label="Post code, city, country"
                      name="businessCity"
                      value={businessCity}
                      onChange={(e) => setBusinessCity(e.target.value)}
                      sx={{ ...outlinedFieldSx, mb: 0 }}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                <SectionTitle
                  icon={GavelOutlinedIcon}
                  title="Tax & registration"
                  subtitle="Shown on PDF invoices when applicable."
                />
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      {...fieldProps}
                      label="VAT number"
                      name="vat"
                      value={vat}
                      onChange={(e) => setVat(e.target.value)}
                      sx={{ ...outlinedFieldSx, mb: 0 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      {...fieldProps}
                      label="T.I.C. / company ID"
                      name="tic"
                      value={tic}
                      onChange={(e) => setTic(e.target.value)}
                      sx={{ ...outlinedFieldSx, mb: 0 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      {...fieldProps}
                      label="Default VAT rate"
                      type="number"
                      name="vatRate"
                      value={vatRate}
                      onChange={(e) => setVatRate(e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                      }}
                      inputProps={{ min: 0, max: 100, step: 0.5 }}
                      helperText="Applied to new invoice line totals before issuing."
                      sx={{ ...outlinedFieldSx, mb: 0 }}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                <SectionTitle
                  icon={AccountBalanceOutlinedIcon}
                  title="Bank details"
                  subtitle="Payment instructions on your invoices."
                />
                <Grid container spacing={2.5}>
                  <Grid item xs={12}>
                    <TextField
                      {...fieldProps}
                      label="Bank name"
                      name="bankName"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      sx={{
                        ...outlinedFieldSx,
                        mb: 0,
                        "& .MuiInputBase-input": {
                          py: 1.5,
                          textTransform: "capitalize",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      {...fieldProps}
                      label="Account number"
                      name="bankNo"
                      value={bankNo}
                      onChange={(e) => setBankNo(e.target.value)}
                      sx={{ ...outlinedFieldSx, mb: 0 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <TextField
                      {...fieldProps}
                      label="IBAN"
                      name="iban"
                      value={iban}
                      onChange={(e) => setIban(e.target.value.toUpperCase())}
                      inputProps={{ spellCheck: false }}
                      sx={{
                        ...outlinedFieldSx,
                        mb: 0,
                        "& .MuiInputBase-input": { py: 1.5, fontFamily: "ui-monospace, monospace" },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      {...fieldProps}
                      label="SWIFT / BIC"
                      name="swift"
                      value={swift}
                      onChange={(e) => setSwift(e.target.value.toUpperCase())}
                      sx={{
                        ...outlinedFieldSx,
                        mb: 0,
                        "& .MuiInputBase-input": { py: 1.5, textTransform: "uppercase" },
                      }}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                <SectionTitle
                  icon={ImageOutlinedIcon}
                  title="Logo"
                  subtitle="Optional but recommended — appears at the top of invoices."
                />
                <input
                  ref={logoInputRef}
                  id="logo-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  hidden
                  name="logo"
                  onChange={handleFileReader}
                />
                <Box
                  onDrop={handleLogoDrop}
                  onDragOver={handleLogoDragOver}
                  onDragLeave={handleLogoDragLeave}
                  sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "2px dashed",
                    borderColor: logoDragActive
                      ? "var(--color-brand-primary)"
                      : "var(--color-border-soft)",
                    bgcolor: logoDragActive
                      ? "rgba(15, 118, 110, 0.06)"
                      : "rgba(248, 250, 252, 0.9)",
                    transition:
                      "border-color 0.2s ease, background-color 0.2s ease",
                  }}
                >
                  <Box
                    component="label"
                    htmlFor="logo-upload"
                    sx={{
                      display: "block",
                      cursor: "pointer",
                      p: { xs: 2.5, sm: 3 },
                      "&:focus-within": {
                        outline: "2px solid",
                        outlineColor: "primary.main",
                        outlineOffset: 2,
                      },
                    }}
                  >
                    {hasCustomLogo ? (
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={3}
                        alignItems="center"
                      >
                        <Box
                          sx={{
                            width: "100%",
                            maxWidth: 280,
                            height: 140,
                            borderRadius: 2,
                            bgcolor: "#fff",
                            border: "1px solid",
                            borderColor: "var(--color-border-soft)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            p: 2,
                            flexShrink: 0,
                          }}
                        >
                          <Box
                            component="img"
                            src={logo}
                            alt="Logo preview"
                            sx={{
                              maxWidth: "100%",
                              maxHeight: 108,
                              objectFit: "contain",
                            }}
                          />
                        </Box>
                        <Stack spacing={1.25} sx={{ flex: 1, minWidth: 0 }}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <CheckCircleOutlineIcon
                              color="primary"
                              sx={{ fontSize: 22 }}
                            />
                            <Typography variant="subtitle2" fontWeight={600}>
                              Image ready
                            </Typography>
                          </Stack>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              wordBreak: "break-all",
                            }}
                          >
                            {logoFileName || "Selected image"}
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ pt: 0.5 }}>
                            <Button
                              type="button"
                              size="small"
                              variant="outlined"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                logoInputRef.current?.click();
                              }}
                            >
                              Replace
                            </Button>
                            <Button
                              type="button"
                              size="small"
                              color="inherit"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                clearLogo();
                              }}
                            >
                              Remove
                            </Button>
                          </Stack>
                        </Stack>
                      </Stack>
                    ) : (
                      <Stack
                        alignItems="center"
                        spacing={1.5}
                        sx={{ py: { xs: 3, sm: 4 }, px: 1 }}
                      >
                        <Box
                          sx={{
                            width: 64,
                            height: 64,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "var(--color-brand-accent)",
                            color: "var(--color-brand-primary)",
                          }}
                        >
                          <CloudUploadOutlinedIcon sx={{ fontSize: 34 }} />
                        </Box>
                        <Typography variant="subtitle1" fontWeight={600} textAlign="center">
                          Drop your logo here or click to browse
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          textAlign="center"
                          sx={{ maxWidth: 360 }}
                        >
                          PNG, JPG or WebP · up to 5 MB · transparent PNGs work well
                        </Typography>
                        <Button
                          type="button"
                          variant="contained"
                          color="primary"
                          sx={{ mt: 1 }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            logoInputRef.current?.click();
                          }}
                        >
                          Choose file
                        </Button>
                      </Stack>
                    )}
                  </Box>
                </Box>

                <Stack spacing={2} sx={{ mt: 4 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={submitting}
                    sx={{
                      py: 1.35,
                      fontWeight: 600,
                      boxShadow:
                        "0 4px 20px rgba(15, 118, 110, 0.12), 0 2px 8px rgba(15, 23, 42, 0.06)",
                    }}
                  >
                    {submitting ? "Saving…" : "Save and continue to dashboard"}
                  </Button>
                  <Typography variant="caption" color="text.secondary" textAlign="center">
                    You can update these details later from your account when editing is available.
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
