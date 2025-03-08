import { isPositiveInt } from "./isPositiveInt";

export const isPositiveFloat = (value: string) => {
  // Handles numbers without a decimal point
  if(isPositiveInt(value)) return true;

  // Handles numbers with a decimal point
  return /^\d+\.\d+$/.test(value);
};
