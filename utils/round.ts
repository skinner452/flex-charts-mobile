export const round = (num: number, precision?: number) => {
  const factor = Math.pow(10, precision ?? 0);
  return Math.round(num * factor) / factor;
};
