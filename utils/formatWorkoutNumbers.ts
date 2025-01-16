import { ExerciseTypeID } from "@/types/exercise_types";
import { Workout } from "@/types/workouts";
import { formatDurationFromSeconds } from "./formatDuration";

export const formatWorkoutNumbers = (workout: Workout) => {
  if (workout.exercise.exercise_type_id === ExerciseTypeID.STRENGTH) {
    return `${workout.weight} lbs x ${workout.reps} reps x ${workout.sets} sets`;
  }

  if (workout.exercise.exercise_type_id === ExerciseTypeID.CARDIO) {
    return `${workout.distance} mi, ${formatDurationFromSeconds(
      workout.durationSeconds ?? 0
    )}`;
  }

  return "";
};
