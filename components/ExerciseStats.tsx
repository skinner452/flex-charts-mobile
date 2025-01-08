import { ExerciseStatItem, ExerciseStats } from "@/types/exercises";
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";

type Props = {
  stats: ExerciseStats;
};

export const ExerciseStatsComponent = ({ stats }: Props) => {
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
        <Counter label="Weight" value={item.weight} />
        <Counter label="Reps" value={item.reps} />
        <Counter label="Sets" value={item.sets} />
      </View>
    </View>
  );
};

const Counter = ({ label, value }: { label: string; value: number }) => {
  return (
    <View style={{ alignItems: "center", flex: 1 }}>
      <Text variant="headlineSmall">{value}</Text>
      <Text variant="labelSmall">{label}</Text>
    </View>
  );
};
