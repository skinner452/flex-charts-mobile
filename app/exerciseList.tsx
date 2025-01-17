import { useGetExercises } from "@/api/routes/exercises/useGetExercises";
import { AppView } from "@/components/AppView";
import { FooterButtons } from "@/components/FooterButtons";
import { ExerciseTypeNames } from "@/types/exercise_types";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { Divider, Text, TouchableRipple } from "react-native-paper";

export default function Index() {
  const router = useRouter();

  const { data: exercises } = useGetExercises();

  const createExercise = () => {
    router.push({ pathname: "/addExercise" });
  };

  return (
    <AppView>
      <Text variant="headlineLarge" style={{ textAlign: "center" }}>
        Exercises
      </Text>

      <FlashList
        estimatedItemSize={50}
        data={exercises}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({ item: exercise }) => (
          <TouchableRipple
            onPress={() =>
              router.push({
                pathname: `/exerciseDetails`,
                params: { exerciseID: exercise.id.toString() },
              })
            }
          >
            <View
              style={{
                flexDirection: "row",
                gap: 8,
                justifyContent: "space-between",
                padding: 16,
              }}
            >
              <Text>{exercise.name}</Text>
              <Text>{ExerciseTypeNames[exercise.exercise_type_id]}</Text>
            </View>
          </TouchableRipple>
        )}
      />

      <FooterButtons
        primaryLabel="Create exercise"
        primaryAction={() => createExercise()}
        secondaryLabel="Go back"
        secondaryAction={router.back}
      />
    </AppView>
  );
}
