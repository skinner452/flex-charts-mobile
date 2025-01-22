import { useGetExercises } from "@/api/routes/exercises/useGetExercises";
import { usePostWorkouts } from "@/api/routes/workouts/usePostWorkouts";
import { AppView } from "@/components/AppView";
import { CriticalError } from "@/components/CriticalError";
import { DurationPicker } from "@/components/DurationPicker";
import { ExerciseStatsComponent } from "@/components/ExerciseStats";
import { FooterButtons } from "@/components/FooterButtons";
import { FormItem } from "@/components/FormItem";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useValidation, ValidationFields } from "@/hooks/useValidation";
import { ExerciseTypeID } from "@/types/exercise_types";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { Dropdown } from "react-native-paper-dropdown";

export default function Index() {
  const router = useRouter();
  const { sessionID, newExerciseID } = useLocalSearchParams<{
    sessionID: string;
    newExerciseID?: string;
  }>();

  const [exerciseID, setExerciseID] = useState("");

  const globalValidationFields = useMemo(() => {
    return {
      exerciseID: { type: "number", isRequired: true, value: exerciseID },
    } as ValidationFields;
  }, [exerciseID]);
  const globalValidation = useValidation(globalValidationFields);

  // Strength values and validation
  const [weight, setWeight] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const strengthValidationFields = useMemo(() => {
    return {
      weight: { type: "number", value: weight },
      sets: { type: "number", value: sets },
      reps: { type: "number", value: reps },
    } as ValidationFields;
  }, [weight, sets, reps]);
  const strengthValidation = useValidation(strengthValidationFields);

  // Cardio values and validation
  const [distance, setDistance] = useState("");
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [incline, setIncline] = useState("");
  const cardioValidationFields = useMemo(() => {
    return {
      distance: { type: "float", value: distance },
      durationSeconds: {
        type: "number",
        value: durationSeconds.toString(),
      },
      incline: { type: "float", value: incline },
    } as ValidationFields;
  }, [distance, durationSeconds, incline]);
  const cardioValidation = useValidation(cardioValidationFields);

  const { data: exercises, isFetching: isExercisesFetching } =
    useGetExercises();

  const { mutateAsync: createWorkoutAsync, isPending: isCreatingWorkout } =
    usePostWorkouts({
      onSuccess: () => {
        router.back();
      },
      onError: (error) => {
        console.error(error);
      },
    });

  useEffect(() => {
    // When returning from adding a new exercise, select the new exercise
    if (!newExerciseID || !exercises) return;

    const exercise = exercises.find(
      (exercise) => exercise.id === parseInt(newExerciseID)
    );
    if (exercise) {
      setExerciseID(newExerciseID);
      router.setParams({ newExerciseID: undefined });
    }
  }, [exercises, newExerciseID]);

  const selectedExercise = useMemo(
    () => exercises?.find((e) => e.id === parseInt(exerciseID)),
    [exercises, exerciseID]
  );

  const isValid = useMemo(() => {
    if (!globalValidation.isValid) return false;

    if (!selectedExercise) return false;

    if (selectedExercise.exercise_type_id === ExerciseTypeID.STRENGTH) {
      return strengthValidation.isValid;
    }

    if (selectedExercise.exercise_type_id === ExerciseTypeID.CARDIO) {
      return cardioValidation.isValid;
    }

    return false;
  }, [
    globalValidation.isValid,
    selectedExercise,
    strengthValidation.isValid,
    cardioValidation.isValid,
  ]);

  const clearForm = () => {
    setWeight("");
    setSets("");
    setReps("");
    setDistance("");
    setDurationSeconds(0);
    setIncline("");
  };

  const selectExercise = (exerciseID: string | undefined) => {
    clearForm();
    setExerciseID(exerciseID || "");
  };

  const addNewExercise = () => {
    router.navigate("/exercises/create");
  };

  const createWorkout = async () => {
    await createWorkoutAsync({
      sessionID: parseInt(sessionID),
      exerciseID: parseInt(exerciseID),
      weight: weight ? parseFloat(weight) : null,
      sets: sets ? parseInt(sets) : null,
      reps: reps ? parseInt(reps) : null,
      distance: distance ? parseFloat(distance) : null,
      durationSeconds: durationSeconds > 0 ? durationSeconds : null,
      incline: incline ? parseInt(incline) : null,
    });
  };

  if (isExercisesFetching) {
    return <LoadingScreen />;
  }

  if (!exercises) {
    return <CriticalError />;
  }

  return (
    <AppView>
      <View style={{ alignItems: "center" }}>
        <Text variant="headlineLarge">Add Workout</Text>
      </View>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ gap: 24 }}>
          <FormItem
            label="Exercise"
            error={globalValidation.fieldErrors.exerciseID}
          >
            <Dropdown
              disabled={exercises.length === 0}
              options={exercises.map((exercise) => ({
                label: exercise.name,
                value: exercise.id.toString(),
              }))}
              onSelect={selectExercise}
              value={exerciseID}
            />
            <Button mode="text" onPress={() => addNewExercise()}>
              Add new exercise
            </Button>

            {exerciseID ? (
              <ExerciseStatsComponent exerciseID={parseInt(exerciseID)} />
            ) : null}
          </FormItem>

          {/* Strength exercise inputs */}
          {selectedExercise?.exercise_type_id === ExerciseTypeID.STRENGTH ? (
            <>
              <FormItem
                label="Weight (lbs)"
                error={strengthValidation.fieldErrors.weight}
              >
                <TextInput
                  keyboardType="numeric"
                  onChangeText={(value) => setWeight(value)}
                  value={weight}
                  returnKeyType="done"
                />
              </FormItem>

              <FormItem
                label="Reps"
                error={strengthValidation.fieldErrors.reps}
              >
                <TextInput
                  keyboardType="numeric"
                  onChangeText={(value) => setReps(value)}
                  value={reps}
                  returnKeyType="done"
                />
              </FormItem>

              <FormItem
                label="Sets"
                error={strengthValidation.fieldErrors.sets}
              >
                <TextInput
                  keyboardType="numeric"
                  onChangeText={(value) => setSets(value)}
                  value={sets}
                  returnKeyType="done"
                />
              </FormItem>
            </>
          ) : null}

          {/* Cardio exercise inputs */}
          {selectedExercise?.exercise_type_id === ExerciseTypeID.CARDIO ? (
            <>
              <FormItem
                label="Distance (miles)"
                error={cardioValidation.fieldErrors.distance}
              >
                <TextInput
                  keyboardType="numeric"
                  onChangeText={(value) => setDistance(value)}
                  value={distance}
                  returnKeyType="done"
                />
              </FormItem>

              <FormItem
                label="Duration"
                error={cardioValidation.fieldErrors.durationSeconds}
              >
                <DurationPicker
                  totalSeconds={durationSeconds}
                  onChange={(totalSeconds) => setDurationSeconds(totalSeconds)}
                />
              </FormItem>

              <FormItem
                label="Incline / Resistance"
                error={cardioValidation.fieldErrors.incline}
              >
                <TextInput
                  keyboardType="numeric"
                  onChangeText={(value) => setIncline(value)}
                  value={incline}
                  returnKeyType="done"
                />
              </FormItem>
            </>
          ) : null}
        </View>
      </ScrollView>
      <FooterButtons
        primaryLabel="Add"
        primaryAction={() => createWorkout()}
        primaryIsLoading={isCreatingWorkout}
        primaryDisabled={!isValid}
        secondaryLabel="Go back"
        secondaryAction={router.back}
      />
    </AppView>
  );
}
