import { pluralize } from "@/utils/pluralize";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

type Props = {
  startTime: string;
  endTime: string | null;
  format: "pretty" | "ticker";
};

export const useDuration = (props: Props | undefined) => {
  const [seconds, setSeconds] = useState<number | null>(null);

  useEffect(() => {
    if (props === undefined) return;

    // Set the initial value of seconds
    setSeconds(
      dayjs(props.endTime ?? undefined).diff(dayjs(props.startTime), "second")
    );

    const interval = setInterval(() => {
      if (seconds === null) return;

      if (props.endTime === null) {
        setSeconds((prev) => (prev ?? 0) + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [props]);

  if (props === undefined || seconds === null) return null;

  const totalHours = Math.floor(seconds / 3600);
  const totalMinutes = Math.floor(seconds / 60);
  const totalSeconds = seconds;

  const remainingHours = totalHours;
  const remainingMinutes = totalMinutes % 60;
  const remainingSeconds = totalSeconds % 60;

  if (props?.format === "pretty") {
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

  return [remainingHours, remainingMinutes, remainingSeconds]
    .map((v) => String(v).padStart(2, "0"))
    .join(":");
};
