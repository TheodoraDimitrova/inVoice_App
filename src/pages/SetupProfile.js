import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { deleteObject, getDownloadURL, ref, uploadString } from "@firebase/storage";
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
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { setupProfileSchema } from "../schemas/setupProfileSchema";
import {
  LOGO_ACCEPT,
  LOGO_FORMATS_LABEL,
  LOGO_UPLOAD_HINT,
  validateLogo,
} from "../utils/validateLogo";
import { DEFAULT_BUSINESS_LOGO_URL } from "../constants/businessDefaults";
import { messageForFirebaseStorageError } from "../utils/firebaseStorageMessages";
import { getCountryCommercialDefaults } from "../data/countryCommercialRules";
import { normaliseVatInput } from "../utils/vatNumberValidation";

const DEFAULT_LOGO = DEFAULT_BUSINESS_LOGO_URL;

/** RHF field name → accordion panel id (company = always visible, not an accordion). */
const SETUP_FIELD_TO_PANEL = {
  businessName: "company",
  email: "company",
  phone: "company",
  businessAddress: "address",
  postCode: "address",
  city: "address",
  country: "address",
  isVatRegistered: "tax",
  vat: "tax",
  tic: "tax",
  vatRate: "tax",
  bankName: "bank",
  iban: "bank",
  swift: "bank",
  noBankDetailsOnInvoices: "bank",
  logo: "logo",
};

const SETUP_PANEL_LABELS = {
  address: "Business address",
  tax: "Tax & registration",
  bank: "Bank details",
  logo: "Logo",
};

const SETUP_PANEL_ORDER = ["address", "tax", "bank", "logo"];

const SETUP_FIELD_SCROLL_ORDER = [
  "businessName",
  "email",
  "phone",
  "businessAddress",
  "postCode",
  "city",
  "country",
  "isVatRegistered",
  "vat",
  "tic",
  "vatRate",
  "bankName",
  "iban",
  "swift",
  "noBankDetailsOnInvoices",
];

const defaultFormValues = {
  businessName: "",
  email: "",
  phone: "",
  businessAddress: "",
  postCode: "",
  city: "",
  country: "",
  isVatRegistered: false,
  vat: "",
  tic: "",
  vatRate: 20,
  bankName: "",
  iban: "",
  swift: "",
  noBankDetailsOnInvoices: false,
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

const setupAccordionWithDividerSx = {
  ...optionalAccordionSx,
  borderTop: "1px solid rgba(15, 23, 42, 0.08)",
};

const setupAccordionsShellSx = {
  mt: 3,
  p: { xs: 1.5, sm: 2 },
  borderRadius: 2,
  bgcolor: "rgba(15, 23, 42, 0.04)",
  border: "1px solid",
  borderColor: "rgba(15, 23, 42, 0.08)",
};

const accordionHeadingSx = (isOpen) => ({
  fontWeight: isOpen ? 800 : 700,
  fontSize: "1.05rem",
  color: isOpen ? "var(--color-brand-primary)" : "#334155",
});

const SetupProfile = () => {
  const auth = getAuth();
  const [logo, setLogo] = useState(DEFAULT_LOGO);
  const [logoFileName, setLogoFileName] = useState("");
  const [logoDragActive, setLogoDragActive] = useState(false);
  const logoInputRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [businessDocId, setBusinessDocId] = useState(null);
  const [storedLogoUrl, setStoredLogoUrl] = useState("");
  const hydratedRef = useRef(false);
  const validationBannerRef = useRef(null);
  const [openPanels, setOpenPanels] = useState({
    address: true,
    tax: false,
    bank: false,
    logo: false,
  });

  const form = useForm({
    resolver: zodResolver(setupProfileSchema),
    defaultValues: defaultFormValues,
    mode: "onSubmit",
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, errors, submitCount },
  } = form;

  const hasCustomLogo = logo !== DEFAULT_LOGO;

  const showValidationBanner =
    submitCount > 0 && Object.keys(errors).length > 0;

  const erroredPanels = useMemo(() => {
    if (!showValidationBanner) return [];
    const found = new Set();
    for (const key of Object.keys(errors)) {
      const panel = SETUP_FIELD_TO_PANEL[key];
      if (panel && panel !== "company") found.add(panel);
    }
    return SETUP_PANEL_ORDER.filter((p) => found.has(p));
  }, [errors, showValidationBanner]);

  const hasCompanyFieldErrors = useMemo(
    () =>
      showValidationBanner &&
      Boolean(errors.businessName || errors.email || errors.phone),
    [errors.businessName, errors.email, errors.phone, showValidationBanner],
  );

  const onSubmitRejected = useCallback((validationErrors) => {
    const keys = Object.keys(validationErrors);
    setOpenPanels((prev) => {
      const next = { ...prev };
      for (const key of keys) {
        const panel = SETUP_FIELD_TO_PANEL[key];
        if (panel && panel !== "company") next[panel] = true;
      }
      return next;
    });
    window.setTimeout(() => {
      validationBannerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      const ordered = [...keys].sort(
        (a, b) =>
          SETUP_FIELD_SCROLL_ORDER.indexOf(a) -
          SETUP_FIELD_SCROLL_ORDER.indexOf(b),
      );
      for (const name of ordered) {
        const el = document.querySelector(
          `input[name="${name}"], textarea[name="${name}"], select[name="${name}"]`,
        );
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          if (typeof el.focus === "function") {
            try {
              el.focus({ preventScroll: true });
            } catch {
              el.focus();
            }
          }
          break;
        }
      }
    }, 120);
  }, []);

  const panelHasError = useCallback(
    (panelId) => {
      const fields = Object.entries(SETUP_FIELD_TO_PANEL)
        .filter(([, p]) => p === panelId)
        .map(([k]) => k);
      return fields.some((f) => errors[f]);
    },
    [errors],
  );

  useEffect(() => {
    try {
      const q = query(
        collection(db, "businesses"),
        where("user_id", "==", auth.currentUser.uid),
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const rows = [];
        querySnapshot.forEach((d) => {
          rows.push({ id: d.id, ...d.data() });
        });
        setLoading(false);

        if (rows.length > 0) {
          const b = rows[0];
          setBusinessDocId(b.id);
          setStoredLogoUrl(
            typeof b.logo === "string" && b.logo.trim() ? b.logo.trim() : "",
          );
          if (!hydratedRef.current) {
            const vr = Number(b.vatRate);
            reset({
              businessName: b.businessName ?? "",
              email: b.email ?? "",
              phone: b.phone ?? "",
              businessAddress: b.businessAddress ?? "",
              postCode: b.postCode ?? "",
              city: b.city ?? "",
              country: b.country ?? "",
              isVatRegistered:
                typeof b.isVatRegistered === "boolean"
                  ? b.isVatRegistered
                  : Boolean((b.vat ?? "").toString().trim()),
              vat: b.vat ?? "",
              tic: b.tic ?? "",
              vatRate: Number.isNaN(vr) ? 20 : vr,
              bankName: b.bankName ?? "",
              iban: (b.iban ?? "").toString(),
              swift: (b.swift ?? "").toString(),
              noBankDetailsOnInvoices: b.noBankDetailsOnInvoices === true,
            });
            if (b.logo) {
              setLogo(b.logo);
            } else {
              setLogo(DEFAULT_LOGO);
            }
            hydratedRef.current = true;
          }
        } else {
          setBusinessDocId(null);
          setStoredLogoUrl("");
          hydratedRef.current = false;
        }
      });
      return () => unsubscribe();
    } catch (error) {
      console.log(error);
    }
  }, [auth.currentUser.uid, reset]);

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
      console.log("[SetupProfile] submit payload (raw form data):", data);
      const commercial = getCountryCommercialDefaults(data.country);
      const logoIsNewUpload =
        typeof logo === "string" && logo.startsWith("data:");
      const logoCleared = logo === DEFAULT_LOGO;
      const hasStoredLogo =
        typeof storedLogoUrl === "string" &&
        storedLogoUrl.trim().length > 0 &&
        storedLogoUrl !== DEFAULT_LOGO;
      const payload = {
        vatRate: Number(data.vatRate) || 0,
        businessName: data.businessName,
        businessAddress: data.businessAddress,
        postCode: data.postCode,
        city: data.city,
        country: data.country,
        businessCity: `${data.postCode} ${data.city}, ${data.country}`,
        phone: data.phone,
        tic: data.tic,
        isVatRegistered: data.isVatRegistered,
        vat: data.isVatRegistered ? normaliseVatInput(data.vat) : "",
        currency: commercial.currency,
        email: data.email,
        iban: data.iban,
        swift: data.swift,
        bankName: data.bankName,
        noBankDetailsOnInvoices: data.noBankDetailsOnInvoices === true,
        logo: logoCleared ? "" : storedLogoUrl || "",
      };

      const metadata = {
        customMetadata: {
          owner: auth.currentUser.uid,
        },
      };

      if (businessDocId) {
        if (logoIsNewUpload) {
          const imageRef = ref(storage, `businesses/${businessDocId}/image`);
          await uploadString(imageRef, logo, "data_url", metadata);
          const downloadURL = await getDownloadURL(imageRef);
          payload.logo = downloadURL;
        } else if (logoCleared && hasStoredLogo) {
          try {
            const imageRef = ref(storage, `businesses/${businessDocId}/image`);
            await deleteObject(imageRef);
          } catch (deleteErr) {
            if (deleteErr?.code !== "storage/object-not-found") {
              throw deleteErr;
            }
          }
          payload.logo = "";
        }

        await updateDoc(doc(db, "businesses", businessDocId), payload);
        if (logoIsNewUpload) {
          showToast("success", "Profile updated and logo replaced.");
        } else if (logoCleared && hasStoredLogo) {
          showToast("success", "Profile updated and logo removed.");
        } else {
          showToast("success", "Profile updated.");
        }
        navigate("/dashboard");
        return;
      }

      const docRef = await addDoc(collection(db, "businesses"), {
        user_id: auth.currentUser.uid,
        ...payload,
        invoices: 0,
      });

      if (logo !== DEFAULT_LOGO) {
        try {
          const imageRef = ref(storage, `businesses/${docRef.id}/image`);
          await uploadString(imageRef, logo, "data_url", metadata);
          const downloadURL = await getDownloadURL(imageRef);
          await updateDoc(doc(db, "businesses", docRef.id), {
            logo: downloadURL,
          });
          showToast("success", "Your business profile is ready.");
        } catch (uploadErr) {
          if (uploadErr?.code === "storage/quota-exceeded") {
            showToast(
              "error",
              "Your business profile was created, but the logo could not be uploaded: Firebase Storage quota is full. Free space in Firebase Console → Storage or upgrade, then add a logo from Profile settings.",
            );
            navigate("/dashboard");
            return;
          }
          throw uploadErr;
        }
      } else {
        showToast(
          "success",
          "Profile saved. You can add a logo later from settings when available.",
        );
      }
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      const storageMsg = messageForFirebaseStorageError(err);
      showToast(
        "error",
        storageMsg ?? "Could not save profile. Please try again.",
      );
    }
  };

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
          <Container
            maxWidth="lg"
            sx={{ pt: { xs: 3, sm: 4 }, px: { xs: 2, sm: 3 } }}
          >
            <Grid container spacing={{ xs: 3, lg: 4 }} alignItems="flex-start">
              <Grid item xs={12} lg={8}>
                <Box sx={{ mb: 3, textAlign: "left" }}>
                  <Typography
                    variant="overline"
                    sx={{
                      display: "block",
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
                    color="text.secondary"
                    sx={{ maxWidth: 640 }}
                  >
                    Start with company and contact, then open each block for
                    address, tax, bank, and logo. Company + address fields are
                    required. VAT number is required only if VAT-registered.
                    Company ID is required. Bank details are optional as a group
                    (fill all 3), unless you enable "I don't need bank details
                    on my invoices".
                  </Typography>
                </Box>

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
                    onSubmit={handleSubmit(onSubmit, onSubmitRejected)}
                    sx={{ px: { xs: 2, sm: 3, md: 4 }, py: { xs: 3, sm: 4 } }}
                  >
                    {showValidationBanner ? (
                      <Box ref={validationBannerRef} sx={{ mb: 2 }}>
                        <Alert severity="error">
                          <Typography variant="body2" component="div">
                            <strong>Some fields still need attention.</strong>
                            {erroredPanels.length > 0 ? (
                              <>
                                {" "}
                                These sections were opened for you:{" "}
                                {erroredPanels
                                  .map((p) => SETUP_PANEL_LABELS[p])
                                  .join(", ")}
                                .
                              </>
                            ) : null}
                            {hasCompanyFieldErrors ? (
                              <>
                                {" "}
                                {erroredPanels.length > 0
                                  ? "Also check "
                                  : "Check "}
                                <strong>company name and contact</strong> at the top
                                of the form.
                              </>
                            ) : null}
                          </Typography>
                        </Alert>
                      </Box>
                    ) : null}

                    <CompanySection form={form} />

                    <Box sx={setupAccordionsShellSx}>
                      <Accordion
                        expanded={openPanels.address}
                        onChange={(_, expanded) =>
                          setOpenPanels((p) => ({ ...p, address: expanded }))
                        }
                        sx={optionalAccordionSx}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="setup-address-content"
                          id="setup-address-header"
                          sx={{ px: 1, opacity: 0.92 }}
                        >
                          <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="flex-start"
                          >
                            <Box sx={accordionIconBoxSx}>
                              <PlaceOutlinedIcon fontSize="small" />
                            </Box>
                            <Box sx={{ minWidth: 0, flex: 1 }}>
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                                flexWrap="wrap"
                              >
                                <Typography
                                  sx={accordionHeadingSx(openPanels.address)}
                                >
                                  Business address
                                </Typography>
                                {panelHasError("address") ? (
                                  <Chip
                                    label="Needs fix"
                                    size="small"
                                    color="error"
                                    variant="outlined"
                                    sx={{ height: 22 }}
                                  />
                                ) : null}
                              </Stack>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 0.25 }}
                              >
                                All fields in this section are required.
                              </Typography>
                            </Box>
                          </Stack>
                        </AccordionSummary>
                        <AccordionDetails
                          sx={{ px: { xs: 1, sm: 2 }, pt: 0, pb: 2 }}
                        >
                          <AddressSection
                            form={form}
                            showTitle={false}
                            onCountryChange={(c) => {
                              const d = getCountryCommercialDefaults(c);
                              const rate =
                                d.standardVatRate != null && !Number.isNaN(Number(d.standardVatRate))
                                  ? Number(d.standardVatRate)
                                  : 0;
                              form.setValue("vatRate", rate, {
                                shouldValidate: false,
                                shouldDirty: false,
                              });
                            }}
                          />
                        </AccordionDetails>
                      </Accordion>

                      <Accordion
                        expanded={openPanels.tax}
                        onChange={(_, expanded) =>
                          setOpenPanels((p) => ({ ...p, tax: expanded }))
                        }
                        sx={setupAccordionWithDividerSx}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="setup-tax-content"
                          id="setup-tax-header"
                          sx={{ px: 1, opacity: 0.92 }}
                        >
                          <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="flex-start"
                          >
                            <Box sx={accordionIconBoxSx}>
                              <GavelOutlinedIcon fontSize="small" />
                            </Box>
                            <Box sx={{ minWidth: 0, flex: 1 }}>
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                                flexWrap="wrap"
                              >
                                <Typography
                                  sx={accordionHeadingSx(openPanels.tax)}
                                >
                                  Tax & registration
                                </Typography>
                                {panelHasError("tax") ? (
                                  <Chip
                                    label="Needs fix"
                                    size="small"
                                    color="error"
                                    variant="outlined"
                                    sx={{ height: 22 }}
                                  />
                                ) : null}
                              </Stack>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 0.25 }}
                              >
                                VAT ID is required only when VAT-registered.
                                Company / trade ID is required.
                                Currency follows your country (shown in this section).
                              </Typography>
                            </Box>
                          </Stack>
                        </AccordionSummary>
                        <AccordionDetails
                          sx={{ px: { xs: 1, sm: 2 }, pt: 0, pb: 2 }}
                        >
                          <TaxSection form={form} showTitle={false} />
                        </AccordionDetails>
                      </Accordion>

                      <Accordion
                        expanded={openPanels.bank}
                        onChange={(_, expanded) =>
                          setOpenPanels((p) => ({ ...p, bank: expanded }))
                        }
                        sx={setupAccordionWithDividerSx}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="setup-bank-content"
                          id="setup-bank-header"
                          sx={{ px: 1, opacity: 0.92 }}
                        >
                          <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="flex-start"
                          >
                            <Box sx={accordionIconBoxSx}>
                              <AccountBalanceOutlinedIcon fontSize="small" />
                            </Box>
                            <Box sx={{ minWidth: 0, flex: 1 }}>
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                                flexWrap="wrap"
                              >
                                <Typography
                                  sx={accordionHeadingSx(openPanels.bank)}
                                >
                                  Bank details
                                </Typography>
                                {panelHasError("bank") ? (
                                  <Chip
                                    label="Needs fix"
                                    size="small"
                                    color="error"
                                    variant="outlined"
                                    sx={{ height: 22 }}
                                  />
                                ) : null}
                              </Stack>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 0.25 }}
                              >
                                Optional block: leave all fields empty, or fill
                                bank name, IBAN, and SWIFT/BIC together. You can
                                also mark that bank details are not needed.
                              </Typography>
                            </Box>
                          </Stack>
                        </AccordionSummary>
                        <AccordionDetails
                          sx={{ px: { xs: 1, sm: 2 }, pt: 0, pb: 2 }}
                        >
                          <BankSection form={form} showTitle={false} />
                        </AccordionDetails>
                      </Accordion>

                      <Accordion
                        expanded={openPanels.logo}
                        onChange={(_, expanded) =>
                          setOpenPanels((p) => ({ ...p, logo: expanded }))
                        }
                        sx={setupAccordionWithDividerSx}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="setup-logo-content"
                          id="setup-logo-header"
                          sx={{ px: 1, opacity: 0.92 }}
                        >
                          <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="flex-start"
                          >
                            <Box sx={accordionIconBoxSx}>
                              <ImageOutlinedIcon fontSize="small" />
                            </Box>
                            <Box sx={{ minWidth: 0, flex: 1 }}>
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                                flexWrap="wrap"
                              >
                                <Typography
                                  sx={accordionHeadingSx(openPanels.logo)}
                                >
                                  Logo
                                </Typography>
                                {panelHasError("logo") ? (
                                  <Chip
                                    label="Needs fix"
                                    size="small"
                                    color="error"
                                    variant="outlined"
                                    sx={{ height: 22 }}
                                  />
                                ) : null}
                              </Stack>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 0.25 }}
                              >
                                {`Image file for the header of your invoice PDFs (${LOGO_FORMATS_LABEL}).`}
                              </Typography>
                            </Box>
                          </Stack>
                        </AccordionSummary>
                        <AccordionDetails
                          sx={{ px: { xs: 1, sm: 2 }, pt: 0, pb: 2 }}
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
                            compact={false}
                            showTitle={false}
                          />
                        </AccordionDetails>
                      </Accordion>
                    </Box>

                    <Box sx={{ mt: 4 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
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
                          : businessDocId
                            ? "Save changes"
                            : "Complete setup later and go to dashboard"}
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} lg={4}>
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
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700, mb: 1.5, color: "#0f172a" }}
                  >
                    Tips
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, lineHeight: 1.55 }}
                  >
                    <strong>Logo:</strong> Optional for unlock, but valuable for
                    trust. A clear logo makes invoices look professional and
                    recognizable.
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, lineHeight: 1.55 }}
                  >
                    <strong>Required:</strong> <strong>Company</strong> +{" "}
                    <strong>Address</strong>. <strong>VAT ID</strong> only when
                    VAT-registered.
                    <br />
                    <strong>Required:</strong> <strong>Company ID (TIC)</strong>.
                    <br />
                    <strong>Optional:</strong> <strong>Logo</strong>.
                    <br />
                    <strong>Bank:</strong> provide <strong>Bank name</strong>,{" "}
                    <strong>IBAN</strong>, <strong>SWIFT/BIC</strong> together,
                    or enable <strong>"I don't need bank details on my invoices"</strong>.
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", lineHeight: 1.5 }}
                  >
                    <strong>Unlock New invoice:</strong> complete{" "}
                    <strong>VAT settings</strong> +{" "}
                    <strong>bank details (or no-bank option)</strong>.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      )}
    </>
  );
};

export default SetupProfile;
