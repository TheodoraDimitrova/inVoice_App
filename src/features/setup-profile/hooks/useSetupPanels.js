import { useCallback, useMemo, useRef, useState } from "react";
import {
  SETUP_FIELD_TO_PANEL,
  SETUP_PANEL_ORDER,
} from "../utils/setupFieldMapping";
import { scrollToValidationError } from "../utils/validationScroll";

export const useSetupPanels = ({ errors, submitCount }) => {
  const validationBannerRef = useRef(null);
  const [openPanels, setOpenPanels] = useState({
    address: true,
    tax: false,
    bank: false,
    logo: false,
  });

  const showValidationBanner =
    submitCount > 0 && Object.keys(errors).length > 0;

  const erroredPanels = useMemo(() => {
    if (!showValidationBanner) return [];
    const found = new Set();
    for (const key of Object.keys(errors)) {
      const panel = SETUP_FIELD_TO_PANEL[key];
      if (panel && panel !== "company") found.add(panel);
    }
    return SETUP_PANEL_ORDER.filter((panel) => found.has(panel));
  }, [errors, showValidationBanner]);

  const hasCompanyFieldErrors = useMemo(
    () =>
      showValidationBanner &&
      Boolean(errors.businessName || errors.email || errors.phone),
    [errors.businessName, errors.email, errors.phone, showValidationBanner],
  );

  const panelHasError = useCallback(
    (panelId) => {
      const fields = Object.entries(SETUP_FIELD_TO_PANEL)
        .filter(([, mappedPanel]) => mappedPanel === panelId)
        .map(([field]) => field);
      return fields.some((field) => errors[field]);
    },
    [errors],
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
    scrollToValidationError(keys, validationBannerRef);
  }, []);

  return {
    openPanels,
    setOpenPanels,
    showValidationBanner,
    validationBannerRef,
    erroredPanels,
    hasCompanyFieldErrors,
    panelHasError,
    onSubmitRejected,
  };
};
