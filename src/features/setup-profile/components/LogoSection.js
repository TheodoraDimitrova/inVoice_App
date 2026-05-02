import React from "react";
import { Button } from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { LOGO_FORMATS_LABEL } from "../../../utils/validateLogo";
import { SectionTitle } from "./SectionTitle";

export const LogoSection = ({
  logo,
  logoFileName,
  logoDragActive,
  logoInputRef,
  hasCustomLogo,
  onFileChange,
  onDrop,
  onDragOver,
  onDragLeave,
  onClear,
  onChooseClick,
  uploadHint,
  accept,
  compact,
  showTitle = true,
}) => (
  <div className="flex h-full w-full min-w-0 max-w-full flex-col self-stretch">
    {showTitle ? (
      <SectionTitle
        icon={ImageOutlinedIcon}
        title="Лого"
        subtitle={`Изображение за хедъра на вашите PDF фактури (${LOGO_FORMATS_LABEL}).`}
      />
    ) : null}
    <input
      ref={logoInputRef}
      id="logo-upload"
      type="file"
      accept={accept}
      hidden
      name="logo"
      onChange={onFileChange}
    />
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      className={`w-full max-w-full flex-1 self-stretch overflow-hidden rounded-2xl border-2 border-dashed transition-colors ${
        compact ? "min-h-[200px]" : ""
      } ${
        logoDragActive
          ? "border-[var(--color-brand-primary)] bg-[rgba(15,118,110,0.06)]"
          : "border-[var(--color-border-soft)] bg-[rgba(248,250,252,0.9)]"
      }`}
    >
      <label
        htmlFor="logo-upload"
        className={`block h-full cursor-pointer focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[var(--color-brand-primary)] ${
          compact ? "p-4" : "p-5 sm:p-6"
        }`}
      >
        {hasCustomLogo ? (
          <div className={`flex flex-col items-center gap-4 ${compact ? "py-1" : ""}`}>
            <div
              className={`flex w-full items-center justify-center rounded-2xl border border-[var(--color-border-soft)] bg-white p-3 ${
                compact ? "h-[100px] max-w-[200px]" : "h-[140px] max-w-[280px]"
              }`}
            >
              <img
                src={logo}
                alt="Преглед на лого"
                className={`max-w-full object-contain ${
                  compact ? "max-h-[80px]" : "max-h-[108px]"
                }`}
              />
            </div>
            <div className="w-full min-w-0 space-y-2">
              <div className="flex items-center justify-center gap-2">
                <CheckCircleOutlineIcon color="primary" sx={{ fontSize: 20 }} />
                <p className="text-sm font-semibold text-slate-900">
                  Изображението е готово
                </p>
              </div>
              <p className="block break-all text-center text-xs text-slate-500">
                {logoFileName || "Избрано изображение"}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Button
                  type="button"
                  size="small"
                  variant="outlined"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onChooseClick(e);
                  }}
                >
                  Замени
                </Button>
                <Button
                  type="button"
                  size="small"
                  color="inherit"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onClear(e);
                  }}
                >
                  Премахни
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className={`flex flex-col items-center px-2 ${compact ? "gap-2 py-4" : "gap-3 py-8 sm:py-10"}`}>
            <div
              className={`flex items-center justify-center rounded-full bg-[var(--color-brand-accent)] text-[var(--color-brand-primary)] ${
                compact ? "h-12 w-12" : "h-16 w-16"
              }`}
            >
              <CloudUploadOutlinedIcon sx={{ fontSize: compact ? 28 : 34 }} />
            </div>
            <p className={`${compact ? "text-sm" : "text-base"} text-center font-semibold text-slate-900`}>
              Пуснете лого тук или натиснете
            </p>
            <p className="max-w-[280px] text-center text-xs leading-snug text-slate-500">
              {uploadHint}
            </p>
            <Button
              type="button"
              variant="contained"
              color="primary"
              size={compact ? "small" : "medium"}
              sx={{ mt: 0.5 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onChooseClick(e);
              }}
            >
              Избери файл
            </Button>
          </div>
        )}
      </label>
    </div>
  </div>
);
