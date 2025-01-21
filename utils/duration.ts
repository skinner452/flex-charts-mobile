import { pluralize } from "./pluralize";

export type DurationFormat = "ticker" | "pretty";

export const splitDurationSeconds = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds];
};

export const formatDurationFromSeconds = (
  totalSeconds: number,
  format: DurationFormat
) => {
  const [hours, minutes, seconds] = splitDurationSeconds(totalSeconds);

  if (format === "pretty") {
    return [
      hours > 0 ? pluralize("hour", hours) : null,
      minutes > 0 ? pluralize("minute", minutes) : null,
      seconds > 0 ? pluralize("second", seconds) : null,
    ]
      .filter((v) => v !== null)
      .join(" ");
  }

  if (format === "ticker") {
    return [hours > 0 ? hours : null, minutes, seconds]
      .filter((v) => v !== null)
      .map((v) => String(v).padStart(2, "0"))
      .join(":");
  }

  return "";
};
