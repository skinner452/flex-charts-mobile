import dayjs from "dayjs";

/**
 * Gets the last occurrence of a given day of the week (dow) from today
 * @param dow Day of the week (0 = Sunday, 6 = Saturday)
 * @returns Dayjs object representing the last occurrence of the given dow
 */
export const getLastDow = (dow: number) => {
  // Initialize the date to today
  const date = dayjs();

  // Set the day to the last occurrence of dow
  if(date.day() < dow){
    date.set("day", dow - 7);
  } else {
    date.set("day", dow);
  }

  // Set the time to midnight
  date.set("hour", 0);
  date.set("minute", 0);
  date.set("second", 0);
  date.set("millisecond", 0);

  return date;
};
