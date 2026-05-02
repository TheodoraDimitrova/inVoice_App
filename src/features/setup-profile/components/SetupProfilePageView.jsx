import React from "react";
import { Button } from "@mui/material";
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
      <main className="min-h-screen bg-[#f8fafc] bg-[linear-gradient(180deg,#e6faf1_0%,#f8fafc_42%,#f8fafc_100%)] pb-12">
        <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 sm:pt-8">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <SetupProfileHeader />

              <section className="overflow-hidden rounded-3xl border border-[var(--color-border-soft)] bg-white shadow-[0_4px_24px_rgba(15,23,42,0.06),0_1px_2px_rgba(15,23,42,0.04)]">
                <form
                  noValidate
                  onSubmit={submitHandler}
                  className="px-4 py-6 sm:px-6 sm:py-8 md:px-8"
                >
                  {showValidationBanner ? (
                    <div ref={validationBannerRef} className="mb-4">
                      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
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
                      </div>
                    </div>
                  ) : null}

                  <section className="rounded-2xl border border-[rgba(15,23,42,0.08)] bg-[rgba(15,23,42,0.04)] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-5">
                    <CompanySection form={form} />
                  </section>

                  <div className="mt-8 rounded-2xl border border-[rgba(15,23,42,0.08)] bg-[rgba(15,23,42,0.04)] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-5">
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
                  </div>

                  <div className="mt-8">
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
                  </div>
                </form>
              </section>
            </div>
            <div className="lg:col-span-4">
              <SetupProfileSidebar />
            </div>
          </div>
        </div>
      </main>
    )}
  </>
);

export default SetupProfilePageView;
