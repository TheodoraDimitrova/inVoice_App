import React from "react";
import SetupProfilePageView from "../components/SetupProfilePageView";
import { useLogoUpload } from "../hooks/useLogoUpload";
import { useBusinessProfile } from "../hooks/useBusinessProfile";
import { useSetupPanels } from "../hooks/useSetupPanels";
import { SETUP_PANEL_LABELS } from "../utils/setupFieldMapping";

const SetupProfilePageContainer = () => {
  const logoController = useLogoUpload();
  const businessController = useBusinessProfile({
    logo: logoController.logo,
    setLogo: logoController.setLogo,
    defaultLogo: logoController.defaultLogo,
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors, submitCount },
  } = businessController.form;

  const panelController = useSetupPanels({ errors, submitCount });

  return (
    <SetupProfilePageView
      form={businessController.form}
      loading={businessController.loading}
      businessDocId={businessController.businessDocId}
      isSubmitting={isSubmitting}
      openPanels={panelController.openPanels}
      setOpenPanels={panelController.setOpenPanels}
      showValidationBanner={panelController.showValidationBanner}
      validationBannerRef={panelController.validationBannerRef}
      erroredPanels={panelController.erroredPanels}
      hasCompanyFieldErrors={panelController.hasCompanyFieldErrors}
      panelHasError={panelController.panelHasError}
      panelLabels={SETUP_PANEL_LABELS}
      logo={logoController.logo}
      logoFileName={logoController.logoFileName}
      logoDragActive={logoController.logoDragActive}
      logoInputRef={logoController.logoInputRef}
      hasCustomLogo={logoController.hasCustomLogo}
      handleFileReader={logoController.handleFileReader}
      handleLogoDrop={logoController.handleLogoDrop}
      handleLogoDragOver={logoController.handleLogoDragOver}
      handleLogoDragLeave={logoController.handleLogoDragLeave}
      clearLogo={logoController.clearLogo}
      submitHandler={handleSubmit(
        businessController.submitProfile,
        panelController.onSubmitRejected,
      )}
    />
  );
};

export default SetupProfilePageContainer;
