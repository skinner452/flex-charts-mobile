import { useMemo } from "react";

export const useValidation = (
  fields: Record<
    string,
    {
      value: string;
      type: "number" | "decimal" | "string";
      maxLength?: number;
      isRequired?: boolean;
    }
  >
) => {
  const fieldErrors = useMemo(
    () =>
      Object.keys(fields).reduce((acc, key) => {
        const field = fields[key];

        if (!field.value && field.isRequired) {
          acc[key] = "This field is required";
        } else if (field.type === "number") {
          try {
            parseInt(field.value);
          } catch {
            acc[key] = "Must be a number";
          }
        } else if (field.type === "decimal") {
          try {
            parseFloat(field.value);
          } catch {
            acc[key] = "Must be a decimal";
          }
        } else if (field.type === "string") {
          if (field.maxLength && field.value.length > field.maxLength) {
            acc[key] = `Must be less than ${field.maxLength} characters`;
          }
        } else {
          acc[key] = "Invalid field type";
        }

        return acc;
      }, {} as Record<string, string>),
    [fields]
  );

  return {
    isValid: Object.keys(fieldErrors).length === 0,
    fieldErrors,
  };
};
