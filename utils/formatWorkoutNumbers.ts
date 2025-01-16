import { ExerciseTypeID } from "@/types/exercise_types";
import { Workout } from "@/types/workouts";
import { formatDurationFromSeconds } from "./duration";

export const formatWorkoutNumbers = (workout: Workout) => {
  if (workout.exercise.exercise_type_id === ExerciseTypeID.STRENGTH) {
    return [
      workout.weight ? `${workout.weight} lbs` : null,
      workout.reps ? `${workout.reps} reps` : null,
      workout.sets ? `${workout.sets} sets` : null,
    ]
      .filter((v) => v !== null)
      .join(" x ");
  }

  if (workout.exercise.exercise_type_id === ExerciseTypeID.CARDIO) {
    return [
      workout.distance ? `${workout.distance} mi` : null,
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
};
