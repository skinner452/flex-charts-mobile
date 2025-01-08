import { useDeleteExercisesId } from "@/api/routes/exercises/useDeleteExercisesId";
import { useGetExercisesId } from "@/api/routes/exercises/useGetExercisesId";
import { useGetExercisesIdStats } from "@/api/routes/exercises/useGetExercisesIdStats";
import { useGetWorkouts } from "@/api/routes/workouts/useGetWorkouts";
import { AppView } from "@/components/AppView";
import { CriticalError } from "@/components/CriticalError";
import { ExerciseStatsComponent } from "@/components/ExerciseStats";
import { FooterButtons } from "@/components/FooterButtons";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useDialog } from "@/providers/DialogProvider";
import dayjs from "dayjs";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FlatList, View } from "react-native";
import { Divider, Text } from "react-native-paper";

export default function Index() {
  const router = useRouter();
  const { createDialog } = useDialog();

  const { exerciseID } = useLocalSearchParams<{
    exerciseID: string;
  }>();

  const { data: exercise, isLoading: isExerciseLoading } = useGetExercisesId(
    parseInt(exerciseID)
  );

  const { data: exerciseStats, isLoading: isExerciseStatsLoading } =
    useGetExercisesIdStats(parseInt(exerciseID));

  const { data: workouts, isLoading: isWorkoutsLoading } = useGetWorkouts({
    exerciseID: parseInt(exerciseID),
    sort: "-created_on",
  });

  const { mutateAsync: deleteExerciseAsync, isPending: isExerciseDeleting } =
    useDeleteExercisesId(parseInt(exerciseID), {
      onSuccess: () => {
        router.back();
      },
      onError: (error) => {
        console.error(error);
      },
    });

  const promptDelete = () => {
    createDialog({
      title: "Delete exercise",
      content:
        "Are you sure you want to delete this exercise? This will also delete all associated workout data.",
      actions: [
        {
          label: "Cancel",
          callback: () => {},
        },
        {
          label: "Delete",
          callback: async () => {
            await deleteExerciseAsync();
          },
        },
      ],
    });
  };

  if (isExerciseLoading || isExerciseStatsLoading || isWorkoutsLoading) {
    return <LoadingScreen />;
  }

  if (!exercise || !exerciseStats || !workouts) {
    return <CriticalError />;
  }

  return (
    <AppView>
      <Text variant="headlineLarge" style={{ textAlign: "center" }}>
        {exercise?.name}
      </Text>

      {exerciseStats ? <ExerciseStatsComponent stats={exerciseStats} /> : null}

      <FlatList
        style={{ flex: 1 }}
        data={workouts}
        renderItem={({ item: workout }) => (
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              justifyContent: "space-between",
              padding: 16,
            }}
          >
            <Text>{dayjs(workout.created_on).format("MMMM D, YYYY")}</Text>
            <Text>
              {workout.weight} lbs x {workout.reps} reps x {workout.sets} sets
            </Text>
          </View>
        )}
        ItemSeparatorComponent={() => <Divider />}
      />

      <FooterButtons
        primaryLabel="Delete"
        primaryAction={() => promptDelete()}
        primaryIsLoading={isExerciseDeleting}
        secondaryLabel="Go back"
        secondaryAction={router.back}
      />
    </AppView>
  );
}
