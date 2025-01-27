import React from "react";

import { splitDurationSeconds } from "@/utils/duration";
import { useMemo } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { Dropdown } from "react-native-paper-dropdown";

type Props = {
  totalSeconds: number;
  onChange: (totalSeconds: number) => void;
};

export const DurationPicker = (props: Props) => {
  const [hours, minutes, seconds] = useMemo(
    () => splitDurationSeconds(props.totalSeconds),
    [props.totalSeconds]
  );

  const updateDuration = (hours: number, minutes: number, seconds: number) => {
    props.onChange(hours * 3600 + minutes * 60 + seconds);
  };

  const setHours = (value: number) => updateDuration(value, minutes, seconds);
  const setMinutes = (value: number) => updateDuration(hours, value, seconds);
  const setSeconds = (value: number) => updateDuration(hours, minutes, value);

  return (
    <View
      style={{ flexDirection: "row", gap: 8, justifyContent: "space-between" }}
    >
      <DurationDropdown
        value={hours}
        onChange={setHours}
        length={24}
        label="hours"
      />
      <DurationDropdown
        value={minutes}
        onChange={setMinutes}
        length={60}
        label="minutes"
      />
      <DurationDropdown
        value={seconds}
        onChange={setSeconds}
        length={60}
        label="seconds"
      />
    </View>
  );
};

const DurationDropdown = ({
  value,
  onChange,
  length,
  label,
}: {
  value: number;
  onChange: (value: number) => void;
  length: number;
  label: string;
}) => {
  return (
    <View style={{ gap: 8 }}>
      <Dropdown
        options={Array.from({ length }, (_, idx) => ({
          label: String(idx),
          value: String(idx),
        }))}
        onSelect={(value) => onChange(value ? parseInt(value) : 0)}
        value={value.toString()}
      />
      <Text variant="labelLarge" style={{ textAlign: "center" }}>
        {label}
      </Text>
    </View>
  );
};
