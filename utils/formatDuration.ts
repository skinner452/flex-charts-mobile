import { Dayjs } from "dayjs";
import { pluralize } from "./pluralize";

export type DurationFormat = "pretty" | "ticker";

export const formatDurationFromTimes = (
  start: Dayjs,
  end: Dayjs,
  format: DurationFormat = "ticker"
) => {
  const seconds = end.diff(start, "second");
  return formatDurationFromSeconds(seconds, format);
};

export const formatDurationFromSeconds = (
  seconds: number,
  format: DurationFormat = "ticker"
) => {
  const totalHours = Math.floor(seconds / 3600);
  const totalMinutes = Math.floor(seconds / 60);
  const totalSeconds = seconds;

  const remainingHours = totalHours;
  const remainingMinutes = totalMinutes % 60;
  const remainingSeconds = totalSeconds % 60;

  if (format === "pretty") {
    const parts = [];
    if (totalHours > 0) {
      parts.push(pluralize("hour", remainingHours));
    }
    if (totalMinutes > 0) {
      parts.push(pluralize("minute", remainingMinutes));
    }
    if (totalSeconds > 0) {
      parts.push(pluralize("second", remainingSeconds));
    }
    return parts.join(" ");
  }

  return [
    remainingHours > 0 ? remainingHours : null,
    remainingMinutes,
    remainingSeconds,
  ]
    .filter((v) => v !== null)
    .map((v) => String(v).padStart(2, "0"))
    .join(":");
};
