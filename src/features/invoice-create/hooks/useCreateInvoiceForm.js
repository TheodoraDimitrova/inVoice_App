import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const useCreateInvoiceForm = ({
  schema,
  defaultValues,
  mode = "onSubmit",
  watchedFields = [],
}) => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode,
  });

  const watchedValuesArray = form.watch(watchedFields);

  const values = useMemo(
    () =>
      watchedFields.reduce((acc, key, idx) => {
        acc[key] = watchedValuesArray?.[idx];
        return acc;
      }, {}),
    [watchedFields, watchedValuesArray],
  );

  const setField = (name, value, options) =>
    form.setValue(name, value, {
      shouldDirty: true,
      shouldValidate: true,
      ...(options || {}),
    });

  const setFieldFromEvent = (name, getValue) => (e) => {
    const resolvedValue =
      typeof getValue === "function" ? getValue(e) : e?.target?.value;
    setField(name, resolvedValue);
  };

  return {
    ...form,
    values,
    setField,
    setFieldFromEvent,
  };
};
