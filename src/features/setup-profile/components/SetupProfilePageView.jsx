import React from "react";
import { Alert, Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import Loading from "../../../components/Loading";
import {
  AddressSection,
  BankSection,
  CompanySection,
  LogoSection,
  TaxSection,
} from ".";
import {
  LOGO_ACCEPT,
  LOGO_FORMATS_LABEL,
  LOGO_UPLOAD_HINT,
} from "../../../utils/validateLogo";
import SetupProfileAccordion from "./SetupProfileAccordion";
import SetupProfileHeader from "./SetupProfileHeader";
import SetupProfileSidebar from "./SetupProfileSidebar";

const setupAccordionsShellSx = {
  mt: 3,
  p: { xs: 1.5, sm: 2 },
  borderRadius: 2,
  bgcolor: "rgba(15, 23, 42, 0.04)",
  border: "1px solid",
  borderColor: "rgba(15, 23, 42, 0.08)",
};

const SetupProfilePageView = ({
  form,
  loading,
  businessDocId,
  isSubmitting,
  openPanels,
  setOpenPanels,
  showValidationBanner,
  validationBannerRef,
  erroredPanels,
  hasCompanyFieldErrors,
  panelHasError,
  panelLabels,
  logo,
  logoFileName,
  logoDragActive,
  logoInputRef,
  hasCustomLogo,
  handleFileReader,
  handleLogoDrop,
  handleLogoDragOver,
  handleLogoDragLeave,
  clearLogo,
  submitHandler,
}) => (
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
        <Container maxWidth="lg" sx={{ pt: { xs: 3, sm: 4 }, px: { xs: 2, sm: 3 } }}>
          <Grid container spacing={{ xs: 3, lg: 4 }} alignItems="flex-start">
            <Grid item xs={12} lg={8}>
              <SetupProfileHeader />

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
                  onSubmit={submitHandler}
                  sx={{ px: { xs: 2, sm: 3, md: 4 }, py: { xs: 3, sm: 4 } }}
                >
                  {showValidationBanner ? (
                    <Box ref={validationBannerRef} sx={{ mb: 2 }}>
                      <Alert severity="error">
                        <Typography variant="body2" component="div">
                          <strong>Някои полета все още изискват внимание.</strong>
                          {erroredPanels.length > 0 ? (
                            <>
                              {" "}
                              За вас бяха отворени следните секции:{" "}
                              {erroredPanels.map((p) => panelLabels[p]).join(", ")}.
                            </>
                          ) : null}
                          {hasCompanyFieldErrors ? (
                            <>
                              {" "}
                              {erroredPanels.length > 0 ? "Проверете и " : "Проверете "}
                              <strong>име на фирма и контакт</strong> в началото на
                              формата.
                            </>
                          ) : null}
                        </Typography>
                      </Alert>
                    </Box>
                  ) : null}

                  <CompanySection form={form} />

                  <Box sx={setupAccordionsShellSx}>
                    <SetupProfileAccordion
                      panelId="address"
                      first
                      openPanels={openPanels}
                      setOpenPanels={setOpenPanels}
                      panelHasError={panelHasError}
                      icon={<PlaceOutlinedIcon fontSize="small" />}
                      title={panelLabels.address}
                      description="Улица и град са задължителни; пощенският код е по избор."
                    >
                      <AddressSection form={form} showTitle={false} />
                    </SetupProfileAccordion>

                    <SetupProfileAccordion
                      panelId="tax"
                      openPanels={openPanels}
                      setOpenPanels={setOpenPanels}
                      panelHasError={panelHasError}
                      icon={<GavelOutlinedIcon fontSize="small" />}
                      title={panelLabels.tax}
                      description="ЕИК / BULSTAT са задължителни за всички фактури."
                    >
                      <TaxSection form={form} showTitle={false} />
                    </SetupProfileAccordion>

                    <SetupProfileAccordion
                      panelId="bank"
                      openPanels={openPanels}
                      setOpenPanels={setOpenPanels}
                      panelHasError={panelHasError}
                      icon={<AccountBalanceOutlinedIcon fontSize="small" />}
                      title={panelLabels.bank}
                      description="Име на банка, IBAN и SWIFT са задължителни, освен ако включите „Не ми трябват банкови данни във фактурите“."
                    >
                      <BankSection form={form} showTitle={false} />
                    </SetupProfileAccordion>

                    <SetupProfileAccordion
                      panelId="logo"
                      openPanels={openPanels}
                      setOpenPanels={setOpenPanels}
                      panelHasError={panelHasError}
                      icon={<ImageOutlinedIcon fontSize="small" />}
                      title={panelLabels.logo}
                      description={`Изображение за хедъра на вашите PDF фактури (${LOGO_FORMATS_LABEL}).`}
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
                    </SetupProfileAccordion>
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
                        ? "Запазване…"
                        : businessDocId
                          ? "Запази промените"
                          : "Завърши настройката и отиди в таблото"}
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} lg={4}>
              <SetupProfileSidebar />
            </Grid>
          </Grid>
        </Container>
      </Box>
    )}
  </>
);

export default SetupProfilePageView;
