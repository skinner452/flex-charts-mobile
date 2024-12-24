import { ExerciseStatItem } from "@/types/exercises";
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";

type Props = {
  label: string;
  item: ExerciseStatItem;
};

const Counter = ({ label, value }: { label: string; value: number }) => {
  return (
    <View style={{ alignItems: "center", flex: 1 }}>
      <Text variant="headlineSmall">{value}</Text>
      <Text variant="labelSmall">{label}</Text>
    </View>
  );
};

export const ExerciseStatItemDisplay = ({ label, item }: Props) => {
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
