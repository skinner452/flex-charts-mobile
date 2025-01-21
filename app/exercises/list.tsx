import { useGetExercises } from "@/api/routes/exercises/useGetExercises";
import { AppView } from "@/components/AppView";
import { FlashListWithLoading } from "@/components/FlashListWithLoading";
import { FooterButtons } from "@/components/FooterButtons";
import { ExerciseTypeNames } from "@/types/exercise_types";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { Divider, Text, TouchableRipple } from "react-native-paper";

export default function Index() {
  const router = useRouter();

  const { data: exercises, isLoading: isExercisesLoading } = useGetExercises();

  const createExercise = () => {
    router.navigate({ pathname: "/exercises/create" });
  };

  return (
    <AppView>
      <Text variant="headlineLarge" style={{ textAlign: "center" }}>
        Exercises
      </Text>

      <FlashListWithLoading
        isLoading={isExercisesLoading}
        estimatedItemSize={50}
        data={exercises}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({ item: exercise }) => (
          <TouchableRipple
            onPress={() =>
              router.navigate({
                pathname: `/exercises/details`,
                params: { exerciseID: exercise.id.toString() },
              })
            }
          >
            <View
              style={{
                flexDirection: "row",
                gap: 8,
                justifyContent: "space-between",
                alignItems: "center",
                padding: 16,
              }}
            >
              <Text variant="bodyLarge">{exercise.name}</Text>
              <Text variant="labelSmall">
                {ExerciseTypeNames[exercise.exercise_type_id]}
              </Text>
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
