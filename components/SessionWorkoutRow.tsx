import { useDeleteWorkoutsId } from "@/api/routes/workouts/useDeleteWorkoutsId";
import { Workout } from "@/types/workouts";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { View } from "react-native";
import { IconButton, Text, TouchableRipple } from "react-native-paper";
import { WorkoutNumbers } from "./WorkoutNumbers";

type Props = {
  workout: Workout;
  canDelete: boolean;
};

export const SessionWorkoutRow = ({ workout, canDelete }: Props) => {
  const router = useRouter();

  const navigateToExercise = useCallback(() => {
    router.navigate({
      pathname: "/exerciseDetails",
      params: { exerciseID: workout.exercise.id.toString() },
    });
  }, [workout, router]);

  const { mutate: deleteWorkout, isPending: isDeletingWorkout } =
    useDeleteWorkoutsId(workout.id);

  return (
    <TouchableRipple onPress={() => navigateToExercise()}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          padding: 16,
        }}
      >
        <Text variant="bodyLarge" style={{ flex: 1, fontWeight: "bold" }}>
          {workout.exercise.name}
        </Text>
        <WorkoutNumbers workout={workout} />
        {canDelete ? (
          <IconButton
            icon="delete"
            mode="contained"
            onPress={() => deleteWorkout()}
            loading={isDeletingWorkout}
            disabled={isDeletingWorkout}
          />
        ) : null}
      </View>
    </TouchableRipple>
  );
};
