import { smartPrecision } from "./smartPrecision";

const thousand = Math.pow(10, 3);
const million = Math.pow(10, 6);
const billion = Math.pow(10, 9);

// Formats a big number to a human-readable format.
// Ex: 1000 -> 1k, 1000000 -> 1m, 1000000000 -> 1b
export const formatBigNumber = (num: number) => {
  if (num < thousand) return smartPrecision(num, 1);
  if (num < million) return smartPrecision(num / thousand, 1) + "k";
  if (num < billion) return smartPrecision(num / million, 1) + "m";
  return smartPrecision(num / billion, 2) + "b";
};
