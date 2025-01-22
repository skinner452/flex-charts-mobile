import { isInt } from "./isInt";

export const isFloat = (value: string) => {
  try {
    // With the float validation below, empty would be considered valid, so we need to explicitly check for that here
    if (value === "") return false;

    // Since floats parse without trailing zeros, we can just split on the decimal point and verify that both parts are integers
    const parts = value.split(".");
    if (parts.length > 2) return false;
    return parts.every((part) => isInt(part));
  } catch {
    return false;
  }
};
