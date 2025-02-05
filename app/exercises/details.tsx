import React from "react";

import { useGetExercisesId } from "@/api/routes/exercises/useGetExercisesId";
import { useGetExercisesIdStats } from "@/api/routes/exercises/useGetExercisesIdStats";
import { useGetWorkouts } from "@/api/routes/workouts/useGetWorkouts";
import { AppView } from "@/components/AppView";
import { CriticalError } from "@/components/CriticalError";
import { ExerciseStatsComponent } from "@/components/ExerciseStats";
import { FlashListWithLoading } from "@/components/FlashListWithLoading";
import { FooterButtons } from "@/components/FooterButtons";
import { LoadingScreen } from "@/components/LoadingScreen";
import { WorkoutNumbers } from "@/components/WorkoutNumbers";
import dayjs from "dayjs";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View } from "react-native";
import { Divider, Text } from "react-native-paper";
import { ProgressChart } from "@/components/ProgressChart";

export default function Index() {
  const router = useRouter();

  const { exerciseID } = useLocalSearchParams<{
    exerciseID: string;
  }>();

  const { data: exercise, isFetching: isExerciseFetching } = useGetExercisesId(
    parseInt(exerciseID)
  );

  const { data: exerciseStats, isFetching: isExerciseStatsFetching } =
    useGetExercisesIdStats(parseInt(exerciseID));

  const { data: workouts, isFetching: isWorkoutsFetching } = useGetWorkouts({
    exerciseID: parseInt(exerciseID),
    sort: "-created_on",
  });

  const onUpdate = () => {
    router.navigate({
      pathname: "/exercises/update",
      params: { exerciseID },
    });
  };

  if (isExerciseFetching || isExerciseStatsFetching || isWorkoutsFetching) {
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

      {exerciseStats ? (
        <ExerciseStatsComponent exerciseID={parseInt(exerciseID)} />
      ) : null}

      <ProgressChart exercise={exercise} />

      <FlashListWithLoading
        estimatedItemSize={80}
        data={workouts}
        isLoading={isWorkoutsFetching}
        renderItem={({ item: workout }) => (
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              justifyContent: "space-between",
              alignItems: "center",
              padding: 16,
            }}
          >
            <View>
              <Text variant="titleSmall">
                {dayjs(workout.created_on).format("MMMM D, YYYY")}
              </Text>
              <Text variant="labelSmall">
                {dayjs(workout.created_on).format("hh:mm:ss A")}
              </Text>
            </View>
            <WorkoutNumbers workout={workout} />
          </View>
        )}
        ItemSeparatorComponent={() => <Divider />}
      />

      <FooterButtons
        primaryLabel="Update"
        primaryAction={() => onUpdate()}
        secondaryLabel="Go back"
        secondaryAction={router.back}
      />
    </AppView>
  );
}
