import React from "react";

import { useGetExercisesIdStats } from "@/api/routes/exercises/useGetExercisesIdStats";
import { ExerciseStatItem } from "@/types/exercise_stats";
import { formatDurationFromSeconds } from "@/utils/duration";
import dayjs from "dayjs";
import { View } from "react-native";
import { Text, TouchableRipple, useTheme } from "react-native-paper";

type Props = {
  exerciseID: number;
  onPress?: (item: ExerciseStatItem) => void;
};

export const ExerciseStatsComponent = ({ exerciseID, onPress }: Props) => {
  const { data: stats } = useGetExercisesIdStats(exerciseID);

  if (!stats) return null;

  if (!stats.best && !stats.last) {
    return null;
  }

  return (
    <View style={{ flexDirection: "row", gap: 16 }}>
      {stats.best ? (
        <StatComponent item={stats.best} label="Best" onPress={onPress} />
      ) : null}
      {stats.last ? (
        <StatComponent item={stats.last} label="Last" onPress={onPress} />
      ) : null}
    </View>
  );
};

const StatComponent = ({
  label,
  item,
  onPress,
}: {
  label: string;
  item: ExerciseStatItem;
  onPress?: (item: ExerciseStatItem) => void;
}) => {
  const theme = useTheme();

  return (
    <TouchableRipple
      style={{ flex: 1 }}
      onPress={onPress ? () => onPress(item) : undefined}
    >
      <View
        style={{
          alignItems: "center",
          backgroundColor: theme.colors.elevation.level1,
          padding: 8,
          borderRadius: 16,
          gap: 8,
        }}
      >
        <Text variant="labelLarge">{label}</Text>
        <View
          style={{
            flexDirection: "row",
            gap: 16,
          }}
        >
          {item.weight ? <Counter label="Weight" value={item.weight} /> : null}
          {item.reps ? <Counter label="Reps" value={item.reps} /> : null}
          {item.distance ? (
            <Counter label="Dist (mi)" value={item.distance} />
          ) : null}
          {item.durationSeconds ? (
            <Counter
              label="Time"
              value={formatDurationFromSeconds(item.durationSeconds, "ticker")}
              isSmall
            />
          ) : null}
        </View>
        <Text variant="labelSmall">
          {dayjs(item.date).format("MM-DD-YYYY")}
        </Text>
      </View>
    </TouchableRipple>
  );
};

const Counter = ({
  label,
  value,
  isSmall,
}: {
  label: string;
  value: number | string;
  isSmall?: boolean;
}) => {
  return (
    <View style={{ alignItems: "center", flex: 1 }}>
      <Text
        variant="headlineSmall"
        style={isSmall ? { fontSize: 16 } : undefined}
      >
        {value}
      </Text>
      <Text variant="labelSmall">{label}</Text>
    </View>
  );
};
