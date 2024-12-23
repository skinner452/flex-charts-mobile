import { AppView } from "@/components/AppView";
import { FooterButtons } from "@/components/FooterButtons";
import { FormItem } from "@/components/FormItem";
import { TextInputWithUnits } from "@/components/TextInputWithUnits";
import { useAPI } from "@/hooks/useAPI";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addSessionWorkout } from "@/redux/slices/sessionWorkouts";
import { Workout, WorkoutCreate } from "@/types/workouts";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { Dropdown } from "react-native-paper-dropdown";

export default function Index() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { session_id } = params;

  const exercises = useAppSelector((state) => state.exercises);
  const exercisesLength = useRef(exercises.length);
  const dispatch = useAppDispatch();

  const [exerciseId, setExerciseId] = useState("");
  const [weight, setWeight] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const apiClient = useAPI();

  useEffect(() => {
    // If the exercise length changes, a new exercise was added and we should automatically select it
    if (exercises.length > exercisesLength.current) {
      exercisesLength.current = exercises.length;
      if (exercises.length > 0) {
        setExerciseId(exercises[exercises.length - 1].id.toString());
      }
    }
  }, [exercises]);

  const addNewExercise = () => {
    router.push("/addExercise");
  };

  const createWorkout = () => {
    setIsLoading(true);
    apiClient
      .post("workouts", {
        exerciseID: parseInt(exerciseId),
        weight: parseFloat(weight),
        sets: parseInt(sets),
        reps: parseInt(reps),
        sessionID: parseInt(session_id as string),
      } as WorkoutCreate)
      .then((workout: Workout) => {
        dispatch(addSessionWorkout(workout));
        router.back();
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <AppView style={{ gap: 16 }}>
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
              onSelect={(value) => setExerciseId(value ?? "")}
              value={exerciseId}
            />
            <Button mode="text" onPress={() => addNewExercise()}>
              Add new exercise
            </Button>
          </FormItem>

          <FormItem label="Weight">
            <TextInputWithUnits
              keyboardType="numeric"
              units="lbs"
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
        primaryLabel="Create"
        primaryAction={() => createWorkout()}
        primaryIsLoading={isLoading}
        secondaryLabel="Go back"
        secondaryAction={router.back}
      />
    </AppView>
  );
}
