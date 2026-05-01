import { useCallback, useRef, useState } from "react";
import { validateLogo } from "../../../utils/validateLogo";
import { DEFAULT_BUSINESS_LOGO_URL } from "../../../constants/businessDefaults";
import { showToast } from "../../../utils/functions";

const DEFAULT_LOGO = DEFAULT_BUSINESS_LOGO_URL;

export const useLogoUpload = () => {
  const logoInputRef = useRef(null);
  const [logo, setLogo] = useState(DEFAULT_LOGO);
  const [logoFileName, setLogoFileName] = useState("");
  const [logoDragActive, setLogoDragActive] = useState(false);

  const hasCustomLogo = logo !== DEFAULT_LOGO;

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

  const handleFileReader = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      applyLogoFile(file);
      e.target.value = "";
    },
    [applyLogoFile],
  );

  const handleLogoDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setLogoDragActive(false);
      const file = e.dataTransfer.files?.[0];
      if (file) applyLogoFile(file);
    },
    [applyLogoFile],
  );

  const handleLogoDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setLogoDragActive(true);
  }, []);

  const handleLogoDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setLogoDragActive(false);
  }, []);

  const clearLogo = useCallback(() => {
    setLogo(DEFAULT_LOGO);
    setLogoFileName("");
    if (logoInputRef.current) logoInputRef.current.value = "";
  }, []);

  return {
    logo,
    setLogo,
    logoFileName,
    logoDragActive,
    logoInputRef,
    hasCustomLogo,
    handleFileReader,
    handleLogoDrop,
    handleLogoDragOver,
    handleLogoDragLeave,
    clearLogo,
    defaultLogo: DEFAULT_LOGO,
  };
};
