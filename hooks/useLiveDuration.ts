import { DurationFormat, formatDurationFromSeconds } from "@/utils/duration";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

type Props = {
  startTime: string;
  endTime: string | null;
  format: DurationFormat;
};

export const useLiveDuration = (props: Props | undefined) => {
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

  return formatDurationFromSeconds(seconds, props.format);
};
