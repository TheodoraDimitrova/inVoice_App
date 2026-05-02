import React from "react";
import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import { FormFieldHelperText } from "../../../components/FormFieldHelperText";
import { gridFieldSx, setupProfileFieldProps } from "../../../utils/muiFieldSx";
import { SectionTitle } from "./SectionTitle";

const fieldProps = setupProfileFieldProps;

export const CompanySection = ({ form }) => {
  const { control } = form;

  return (
    <>
      <SectionTitle
        icon={BusinessOutlinedIcon}
        title="Фирма и контакт"
        subtitle="Търговско/юридическо име и фирмен имейл са задължителни; телефонът е по избор."
      />
      <div className="grid grid-cols-12 items-start gap-6">
        <div className="col-span-12 min-w-0 sm:col-span-6">
          <Controller
            name="businessName"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...fieldProps}
                {...field}
                label="Име на фирма"
                autoComplete="organization"
                error={!!fieldState.error}
                helperText={
                  <FormFieldHelperText
                    errorMessage={fieldState.error?.message}
                    hint={fieldState.error ? undefined : "Задължително поле."}
                  />
                }
                FormHelperTextProps={{ component: "div" }}
                sx={{
                  ...gridFieldSx,
                  "& .MuiInputBase-input": {
                    py: 1.5,
                    textTransform: "capitalize",
                  },
                }}
              />
            )}
          />
        </div>
        <div className="col-span-12 min-w-0 sm:col-span-6">
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...fieldProps}
                {...field}
                label="Фирмен имейл"
                type="email"
                autoComplete="email"
                error={!!fieldState.error}
                helperText={
                  <FormFieldHelperText
                    errorMessage={fieldState.error?.message}
                    hint={fieldState.error ? undefined : "Задължително поле."}
                  />
                }
                FormHelperTextProps={{ component: "div" }}
                sx={gridFieldSx}
              />
            )}
          />
        </div>
        <div className="col-span-12 min-w-0">
          <Controller
            name="phone"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...fieldProps}
                {...field}
                label="Телефон"
                type="tel"
                autoComplete="tel"
                error={!!fieldState.error}
                helperText={
                  <FormFieldHelperText
                    errorMessage={fieldState.error?.message}
                    hint={
                      fieldState.error
                        ? undefined
                        : "По избор. Пример: +359 889 12 34 67"
                    }
                  />
                }
                FormHelperTextProps={{ component: "div" }}
                sx={gridFieldSx}
              />
            )}
          />
        </div>
      </div>
    </>
  );
};
