import { useGetExercises } from "@/api/routes/exercises/useGetExercises";
import { useGetExercisesIdStats } from "@/api/routes/exercises/useGetExercisesIdStats";
import { usePostWorkouts } from "@/api/routes/workouts/usePostWorkouts";
import { AppView } from "@/components/AppView";
import { CriticalError } from "@/components/CriticalError";
import { ExerciseStatsComponent } from "@/components/ExerciseStats";
import { FooterButtons } from "@/components/FooterButtons";
import { FormItem } from "@/components/FormItem";
import { LoadingScreen } from "@/components/LoadingScreen";
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

  const [exerciseId, setExerciseId] = useState("");

  // Strength values
  const [weight, setWeight] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");

  // Cardio values
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [incline, setIncline] = useState("");

  const { data: exercises, isLoading: isExercisesLoading } = useGetExercises();
  const { data: exerciseStats } = useGetExercisesIdStats(
    exerciseId ? parseInt(exerciseId) : 0,
    { enabled: !!exerciseId }
  );

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
      setExerciseId(newExerciseID);
      router.setParams({ newExerciseID: undefined });
    }
  }, [exercises, newExerciseID]);

  const selectedExercise = useMemo(
    () => exercises?.find((e) => e.id === parseInt(exerciseId)),
    [exercises, exerciseId]
  );

  const clearForm = () => {
    setWeight("");
    setSets("");
    setReps("");
    setDistance("");
    setDuration("");
    setIncline("");
  };

  const selectExercise = (exerciseID: string | undefined) => {
    clearForm();
    setExerciseId(exerciseID || "");
  };

  const addNewExercise = () => {
    router.push("/addExercise");
  };

  const createWorkout = async () => {
    await createWorkoutAsync({
      sessionID: parseInt(sessionID),
      exerciseID: parseInt(exerciseId),
      weight: weight ? parseFloat(weight) : null,
      sets: sets ? parseInt(sets) : null,
      reps: reps ? parseInt(reps) : null,
      distance: distance ? parseFloat(distance) : null,
      durationSeconds: duration ? parseInt(duration) : null,
      incline: incline ? parseInt(incline) : null,
    });
  };

  if (isExercisesLoading) {
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
          <FormItem label="Exercise">
            <Dropdown
              disabled={exercises.length === 0}
              options={exercises.map((exercise) => ({
                label: exercise.name,
                value: exercise.id.toString(),
              }))}
              onSelect={selectExercise}
              value={exerciseId}
            />
            <Button mode="text" onPress={() => addNewExercise()}>
              Add new exercise
            </Button>

            {exerciseStats ? (
              <ExerciseStatsComponent stats={exerciseStats} />
            ) : null}
          </FormItem>

          {/* Strength exercise inputs */}
          {selectedExercise?.exercise_type_id === ExerciseTypeID.STRENGTH ? (
            <>
              <FormItem label="Weight (lbs)">
                <TextInput
                  keyboardType="numeric"
                  onChangeText={(value) => setWeight(value)}
                  value={weight}
                />
              </FormItem>

              <FormItem label="Reps">
                <TextInput
                  keyboardType="numeric"
                  onChangeText={(value) => setReps(value)}
                  value={reps}
                />
              </FormItem>

              <FormItem label="Sets">
                <TextInput
                  keyboardType="numeric"
                  onChangeText={(value) => setSets(value)}
                  value={sets}
                />
              </FormItem>
            </>
          ) : null}

          {/* Cardio exercise inputs */}
          {selectedExercise?.exercise_type_id === ExerciseTypeID.CARDIO ? (
            <>
              <FormItem label="Distance (miles)">
                <TextInput
                  keyboardType="numeric"
                  onChangeText={(value) => setDistance(value)}
                  value={distance}
                />
              </FormItem>

              <FormItem label="Duration">
                <TextInput
                  keyboardType="numeric"
                  onChangeText={(value) => setDuration(value)}
                  value={duration}
                />
              </FormItem>

              <FormItem label="Incline / Resistance">
                <TextInput
                  keyboardType="numeric"
                  onChangeText={(value) => setIncline(value)}
                  value={incline}
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
        secondaryLabel="Go back"
        secondaryAction={router.back}
      />
    </AppView>
  );
}
