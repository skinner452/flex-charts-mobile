import { Session } from "@/types/sessions";
import { DurationFormat, formatDurationFromSeconds } from "@/utils/duration";
import dayjs from "dayjs";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

export const useSessionDuration = (
  session: Session | undefined,
  format: DurationFormat
) => {
  const interval = useRef<NodeJS.Timeout | null>(null);
  const [seconds, setSeconds] = useState<number | null>(null);

  useEffect(() => {
    return () => {
      // Clear the active interval when the component unmounts
      if (interval.current) clearInterval(interval.current);
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      // If we don't have a session, reset the seconds
      if (!session) {
        setSeconds(null);
        return;
      }

      // If we have an ongoing interval, clear it
      if (interval.current) clearInterval(interval.current);

      // Set the initial value of seconds
      const endTime = session.ended_on ?? undefined;
      const startTime = session.created_on;
      const totalSeconds = dayjs(endTime).diff(dayjs(startTime), "second");
      setSeconds(totalSeconds);

      // If there is no end time, start a new interval to increment the seconds
      if (session.ended_on === null) {
        interval.current = setInterval(() => {
          setSeconds((prev) => (prev ?? 0) + 1);
        }, 1000);
      }
    }, [session])
  );

  if (session === undefined || seconds === null) return null;

  return formatDurationFromSeconds(seconds, format);
};
