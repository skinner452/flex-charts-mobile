import { useGetExercises } from "@/api/routes/exercises/useGetExercises";
import { useGetExercisesIdStats } from "@/api/routes/exercises/useGetExercisesIdStats";
import { usePostWorkouts } from "@/api/routes/workouts/usePostWorkouts";
import { AppView } from "@/components/AppView";
import { ExerciseStatItemDisplay } from "@/components/ExerciseStatItem";
import { FooterButtons } from "@/components/FooterButtons";
import { FormItem } from "@/components/FormItem";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
  const [weight, setWeight] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");

  const { data: exercises } = useGetExercises();
  const { data: exerciseStats } = useGetExercisesIdStats(
    exerciseId ? parseInt(exerciseId) : 0,
    { enabled: !!exerciseId }
  );

  const { mutate: createWorkout, isPending: isCreatingWorkout } =
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

  const selectExercise = (exerciseID: string | undefined) => {
    setExerciseId(exerciseID || "");
  };

  const addNewExercise = () => {
    router.push("/addExercise");
  };

  const createWorkoutWithData = () => {
    createWorkout({
      sessionID: parseInt(sessionID),
      exerciseID: parseInt(exerciseId),
      weight: parseFloat(weight),
      sets: parseInt(sets),
      reps: parseInt(reps),
    });
  };

  if (!exercises) {
    return <LoadingScreen />;
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

            {exerciseStats?.best || exerciseStats?.last ? (
              <View style={{ flexDirection: "row", gap: 16 }}>
                {exerciseStats.best ? (
                  <ExerciseStatItemDisplay
                    item={exerciseStats.best}
                    label="Best"
                  />
                ) : null}
                {exerciseStats.last ? (
                  <ExerciseStatItemDisplay
                    item={exerciseStats.last}
                    label="Last"
                  />
                ) : null}
              </View>
            ) : null}
          </FormItem>

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
        </View>
      </ScrollView>
      <FooterButtons
        primaryLabel="Add"
        primaryAction={() => createWorkoutWithData()}
        primaryIsLoading={isCreatingWorkout}
        secondaryLabel="Go back"
        secondaryAction={router.back}
      />
    </AppView>
  );
}
