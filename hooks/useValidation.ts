import { isFloat } from "@/utils/isFloat";
import { isInt } from "@/utils/isInt";
import { useMemo } from "react";

// Exported so that we can check for this specific error
export const REQUIRED_ERROR = "This field is required";

type ValidationField = {
  value: string;
  type: "number" | "float" | "string";
  maxLength?: number;
  isRequired?: boolean;
};

export type ValidationFields = Record<string, ValidationField>;

export const useValidation = (fields: ValidationFields) => {
  const fieldErrors = useMemo(
    () =>
      Object.keys(fields).reduce((acc, key) => {
        const field = fields[key];

        if (!field.value) {
          if (field.isRequired) {
            acc[key] = REQUIRED_ERROR;
          } else {
            // If the field is empty and not required, we don't need to validate it
          }
        } else if (field.type === "number") {
          if (!isInt(field.value)) {
            acc[key] = "Must be a number";
          }
        } else if (field.type === "float") {
          if (!isFloat(field.value)) {
            acc[key] = "Must be a number"; // This makes more sense to the end user than "Must be a float"
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
