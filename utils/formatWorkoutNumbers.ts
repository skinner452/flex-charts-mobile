import { ExerciseTypeID } from "@/types/exercise_types";
import { Workout } from "@/types/workouts";

export const formatWorkoutNumbers = (workout: Workout) => {
  if (workout.exercise.exercise_type_id === ExerciseTypeID.STRENGTH) {
    return `${workout.weight} lbs x ${workout.reps} reps x ${workout.sets} sets`;
  }

  console.log("workout", workout);

  if (workout.exercise.exercise_type_id === ExerciseTypeID.CARDIO) {
    return `${workout.distance} mi, ${workout.durationSeconds}s, ${workout.incline}`;
  }

  return "";
};
