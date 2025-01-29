import dayjs from "dayjs";

// dow: Sunday as 0, Saturday as 6
export const getDateFromDow = (dow: number) => {
  const date = dayjs()
    .set("day", dow)
    .set("hour", 0)
    .set("minute", 0)
    .set("second", 0)
    .set("millisecond", 0);
  return date;
};
