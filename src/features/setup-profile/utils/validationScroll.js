import { SETUP_FIELD_SCROLL_ORDER } from "./setupFieldMapping";

export const scrollToValidationError = (fieldNames, bannerRef) => {
  window.setTimeout(() => {
    bannerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    const ordered = [...fieldNames].sort(
      (a, b) =>
        SETUP_FIELD_SCROLL_ORDER.indexOf(a) - SETUP_FIELD_SCROLL_ORDER.indexOf(b),
    );

    for (const name of ordered) {
      const el = document.querySelector(
        `input[name="${name}"], textarea[name="${name}"], select[name="${name}"]`,
      );
      if (!el) continue;

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
  }, 120);
};
