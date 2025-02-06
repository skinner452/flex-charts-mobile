// Formats a number to a defined precision without trailing zeros.
export const smartPrecision = (num: number, precision: number) => {
  const fixed = num.toFixed(precision);

  // Parsing the number to float removes trailing zeros
  return parseFloat(fixed).toString();
};
