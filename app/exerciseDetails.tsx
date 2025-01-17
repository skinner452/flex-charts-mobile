import { useDeleteExercisesId } from "@/api/routes/exercises/useDeleteExercisesId";
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
import { useDialog } from "@/providers/DialogProvider";
import { ExerciseTypeID } from "@/types/exercise_types";
import dayjs from "dayjs";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { View } from "react-native";
import { CurveType, LineChart, lineDataItem } from "react-native-gifted-charts";
import { Divider, Text, useTheme } from "react-native-paper";

export default function Index() {
  const router = useRouter();
  const theme = useTheme();
  const { createDialog } = useDialog();

  const { exerciseID } = useLocalSearchParams<{
    exerciseID: string;
  }>();

  const { data: exercise, isLoading: isExerciseLoading } = useGetExercisesId(
    parseInt(exerciseID)
  );

  const { data: exerciseStats, isLoading: isExerciseStatsLoading } =
    useGetExercisesIdStats(parseInt(exerciseID));

  const { data: workouts, isLoading: isWorkoutsLoading } = useGetWorkouts({
    exerciseID: parseInt(exerciseID),
    sort: "-created_on",
  });

  const [chartWidth, setChartWidth] = useState(0);

  const graphData = useMemo(() => {
    if (!workouts) return [];

    // Reverse the array so that the oldest workout is leftmost
    return workouts.toReversed().map((workout) => {
      let value = 0;

      if (exercise?.exercise_type_id === ExerciseTypeID.STRENGTH) {
        value = workout.weight ?? 0;
      }

      if (exercise?.exercise_type_id === ExerciseTypeID.CARDIO) {
        value = workout.distance ?? 0;
      }

      return {
        value,
      } as lineDataItem;
    });
  }, [workouts, exercise]);

  const graphStartY = useMemo(() => {
    if (graphData.length === 0) return 0;
    const values = graphData.map((item) => item.value ?? 0);
    const minValue = Math.min(...values);
    return minValue >= 20 ? minValue - 10 : 0;
  }, [graphData]);

  const { mutateAsync: deleteExerciseAsync, isPending: isExerciseDeleting } =
    useDeleteExercisesId(parseInt(exerciseID), {
      onSuccess: () => {
        router.back();
      },
      onError: (error) => {
        console.error(error);
      },
    });

  const promptDelete = () => {
    createDialog({
      title: "Delete exercise",
      content:
        "Are you sure you want to delete this exercise? This will also delete all associated workout data.",
      actions: [
        {
          label: "Cancel",
        },
        {
          label: "Delete",
          callback: async () => {
            await deleteExerciseAsync();
          },
        },
      ],
    });
  };

  if (isExerciseLoading || isExerciseStatsLoading || isWorkoutsLoading) {
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

      <View onLayout={(e) => setChartWidth(e.nativeEvent.layout.width)}>
        {graphData.length > 1 && chartWidth > 0 ? (
          <LineChart
            data={graphData}
            width={chartWidth - 60} // Subtract padding
            height={150}
            noOfSections={5}
            thickness={5}
            roundToDigits={0}
            hideRules
            hideDataPoints
            curved
            curveType={CurveType.QUADRATIC}
            backgroundColor={theme.colors.backdrop}
            color={theme.colors.primary}
            yAxisColor={theme.colors.primary}
            xAxisColor={theme.colors.primary}
            yAxisTextStyle={{
              color: theme.colors.primary,
            }}
            isAnimated={true}
            scrollToEnd
            yAxisOffset={graphStartY}
          />
        ) : null}
      </View>

      <FlashListWithLoading
        estimatedItemSize={80}
        data={workouts}
        isLoading={isWorkoutsLoading}
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
        primaryLabel="Delete"
        primaryAction={() => promptDelete()}
        primaryIsLoading={isExerciseDeleting}
        secondaryLabel="Go back"
        secondaryAction={router.back}
      />
    </AppView>
  );
}
