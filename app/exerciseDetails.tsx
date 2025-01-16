import { useDeleteExercisesId } from "@/api/routes/exercises/useDeleteExercisesId";
import { useGetExercisesId } from "@/api/routes/exercises/useGetExercisesId";
import { useGetExercisesIdStats } from "@/api/routes/exercises/useGetExercisesIdStats";
import { useGetWorkouts } from "@/api/routes/workouts/useGetWorkouts";
import { AppView } from "@/components/AppView";
import { CriticalError } from "@/components/CriticalError";
import { ExerciseStatsComponent } from "@/components/ExerciseStats";
import { FooterButtons } from "@/components/FooterButtons";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useDialog } from "@/providers/DialogProvider";
import { formatWorkoutNumbers } from "@/utils/formatWorkoutNumbers";
import dayjs from "dayjs";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, View } from "react-native";
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

  const weightGraphData = useMemo(() => {
    if (!workouts) return [];

    // Reverse the array so that the oldest workout is leftmost
    return workouts.toReversed().map((workout) => {
      return {
        value: workout.weight,
      } as lineDataItem;
    });
  }, [workouts]);

  const weightGraphStartY = useMemo(() => {
    if (weightGraphData.length === 0) return 0;
    const values = weightGraphData.map((item) => item.value ?? 0);
    const minValue = Math.min(...values);
    return minValue >= 20 ? minValue - 10 : 0;
  }, [weightGraphData]);

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
        {weightGraphData.length > 1 && chartWidth > 0 ? (
          <LineChart
            data={weightGraphData}
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
            yAxisOffset={weightGraphStartY}
          />
        ) : null}
      </View>

      <FlatList
        style={{ flex: 1 }}
        data={workouts}
        renderItem={({ item: workout }) => (
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              justifyContent: "space-between",
              padding: 16,
            }}
          >
            <Text>{dayjs(workout.created_on).format("MMMM D, YYYY")}</Text>
            <Text>{formatWorkoutNumbers(workout)}</Text>
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
