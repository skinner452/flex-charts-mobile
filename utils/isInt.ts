export const isInt = (value: string) => {
  try {
    const int = parseInt(value);
    return !isNaN(int) && int.toString() === value;
  } catch {
    return false;
  }
};
