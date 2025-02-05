import React from "react";

import { ExerciseTypeID } from "@/types/exercise_types";
import { Workout } from "@/types/workouts";
import { formatDurationFromSeconds } from "@/utils/duration";
import { useMemo } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

type Props = {
  workout: Workout;
};

export const WorkoutNumbers = ({ workout }: Props) => {
  const { exercise } = workout;

  const title = useMemo(() => {
    if (exercise.exercise_type_id === ExerciseTypeID.STRENGTH) {
      return workout.weight ? `${workout.weight} lbs` : "";
    }

    if (exercise.exercise_type_id === ExerciseTypeID.CARDIO) {
      return workout.distance ? `${workout.distance} mi` : "";
    }

    return "";
  }, [exercise, workout.weight, workout.distance]);

  const subtitle = useMemo(() => {
    if (exercise.exercise_type_id === ExerciseTypeID.STRENGTH) {
      return [
        workout.reps ? `${workout.reps} reps` : null,
        workout.sets ? `${workout.sets} sets` : null,
      ]
        .filter((v) => v !== null)
        .join(" x ");
    }

    if (exercise.exercise_type_id === ExerciseTypeID.CARDIO) {
      return [
        workout.durationSeconds
          ? formatDurationFromSeconds(workout.durationSeconds, "ticker")
          : null,
        workout.incline
          ? `${workout.incline > 0 ? "+" : ""}${workout.incline}`
          : null,
      ]
        .filter((v) => v !== null)
        .join(", ");
    }

    return "";
  }, [
    exercise.exercise_type_id,
    workout.durationSeconds,
    workout.incline,
    workout.reps,
    workout.sets,
  ]);

  return (
    <View style={{ alignItems: "flex-end" }}>
      {title ? <Text variant="titleMedium">{title}</Text> : null}
      {subtitle ? <Text variant="labelSmall">{subtitle}</Text> : null}
    </View>
  );

  return null;
};
