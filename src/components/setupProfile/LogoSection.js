import React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { LOGO_FORMATS_LABEL } from "../../utils/validateLogo";
import { SectionTitle } from "./SectionTitle";

/**
 * Logo upload UI (state lives in parent for submit + storage upload).
 */
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
  <Box
    sx={{
      width: "100%",
      maxWidth: "100%",
      boxSizing: "border-box",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      minWidth: 0,
      alignSelf: "stretch",
    }}
  >
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
    <Box
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      sx={{
        flex: 1,
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        alignSelf: "stretch",
        borderRadius: 2,
        overflow: "hidden",
        border: "2px dashed",
        borderColor: logoDragActive
          ? "var(--color-brand-primary)"
          : "var(--color-border-soft)",
        bgcolor: logoDragActive
          ? "rgba(15, 118, 110, 0.06)"
          : "rgba(248, 250, 252, 0.9)",
        transition: "border-color 0.2s ease, background-color 0.2s ease",
        minHeight: compact ? 200 : undefined,
      }}
    >
      <Box
        component="label"
        htmlFor="logo-upload"
        sx={{
          display: "block",
          cursor: "pointer",
          p: compact ? { xs: 2, sm: 2 } : { xs: 2.5, sm: 3 },
          height: "100%",
          "&:focus-within": {
            outline: "2px solid",
            outlineColor: "primary.main",
            outlineOffset: 2,
          },
        }}
      >
        {hasCustomLogo ? (
          <Stack
            direction="column"
            spacing={2}
            alignItems="center"
            sx={{ py: compact ? 1 : 0 }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: compact ? 200 : 280,
                height: compact ? 100 : 140,
                borderRadius: 2,
                bgcolor: "#fff",
                border: "1px solid",
                borderColor: "var(--color-border-soft)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 1.5,
              }}
            >
              <Box
                component="img"
                src={logo}
                alt="Преглед на лого"
                sx={{
                  maxWidth: "100%",
                  maxHeight: compact ? 80 : 108,
                  objectFit: "contain",
                }}
              />
            </Box>
            <Stack spacing={1} sx={{ width: "100%", minWidth: 0 }}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="center"
              >
                <CheckCircleOutlineIcon color="primary" sx={{ fontSize: 20 }} />
                <Typography variant="subtitle2" fontWeight={600}>
                  Изображението е готово
                </Typography>
              </Stack>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  wordBreak: "break-all",
                  textAlign: "center",
                  display: "block",
                }}
              >
                {logoFileName || "Избрано изображение"}
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                justifyContent="center"
                flexWrap="wrap"
              >
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
              </Stack>
            </Stack>
          </Stack>
        ) : (
          <Stack
            alignItems="center"
            spacing={compact ? 1 : 1.5}
            sx={{ py: compact ? 2 : { xs: 3, sm: 4 }, px: 1 }}
          >
            <Box
              sx={{
                width: compact ? 48 : 64,
                height: compact ? 48 : 64,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "var(--color-brand-accent)",
                color: "var(--color-brand-primary)",
              }}
            >
              <CloudUploadOutlinedIcon sx={{ fontSize: compact ? 28 : 34 }} />
            </Box>
            <Typography
              variant={compact ? "body2" : "subtitle1"}
              fontWeight={600}
              textAlign="center"
            >
              Пуснете лого тук или натиснете
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              textAlign="center"
              sx={{ maxWidth: 280, lineHeight: 1.4 }}
            >
              {uploadHint}
            </Typography>
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
          </Stack>
        )}
      </Box>
    </Box>
  </Box>
);
