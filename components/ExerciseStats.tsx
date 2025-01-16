import { useGetExercisesIdStats } from "@/api/routes/exercises/useGetExercisesIdStats";
import { ExerciseStatItem } from "@/types/exercise_stats";
import { formatDurationFromSeconds } from "@/utils/formatDuration";
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";

type Props = {
  exerciseID: number;
};

export const ExerciseStatsComponent = ({ exerciseID }: Props) => {
  const { data: stats } = useGetExercisesIdStats(exerciseID);

  if (!stats) return null;

  if (!stats.best && !stats.last) {
    return null;
  }

  return (
    <View style={{ flexDirection: "row", gap: 16 }}>
      {stats.best ? <StatComponent item={stats.best} label="Best" /> : null}
      {stats.last ? <StatComponent item={stats.last} label="Last" /> : null}
    </View>
  );
};

const StatComponent = ({
  label,
  item,
}: {
  label: string;
  item: ExerciseStatItem;
}) => {
  const theme = useTheme();

  return (
    <View
      style={{
        alignItems: "center",
        flex: 1,
        backgroundColor: theme.colors.elevation.level1,
        padding: 8,
        borderRadius: 16,
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
            value={formatDurationFromSeconds(item.durationSeconds)}
            isSmall
          />
        ) : null}
      </View>
    </View>
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
