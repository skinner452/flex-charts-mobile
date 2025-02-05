import { useGetWorkouts } from "@/api/routes/workouts/useGetWorkouts";
import { ExerciseTypeID } from "@/types/exercise_types";
import { Exercise } from "@/types/exercises";
import dayjs from "dayjs";
import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { CurveType, LineChart, lineDataItem } from "react-native-gifted-charts";
import { useTheme } from "react-native-paper";

type Props = {
  exercise: Exercise;
};

export const ProgressChart = ({ exercise }: Props) => {
  const [chartWidth, setChartWidth] = useState(0);

  const theme = useTheme();

  const { data: workouts } = useGetWorkouts({
    exerciseID: exercise.id,
    sort: "created_on",
  });

  const chartData = useMemo(() => {
    if (!workouts) return [];

    // Determine column to use
    let col: "reps" | "weight" | "distance";
    if (exercise.exercise_type_id === ExerciseTypeID.STRENGTH) {
      // Check if it's a bodyweight exercise
      const isBodyWeight = workouts.every((workout) => !workout.weight);
      col = isBodyWeight ? "reps" : "weight";
    } else if (exercise.exercise_type_id === ExerciseTypeID.CARDIO) {
      col = "distance";
    } else {
      // Unsupported exercise type
      return [];
    }

    const dateMap = workouts.reduce((acc, workout) => {
      const date = dayjs(workout.created_on).format("MM-DD-YYYY");

      const value = workout[col] ?? 0;
      const currentValue = acc.get(date) ?? -1;

      if (value > currentValue) {
        acc.set(date, value);
      }

      return acc;
    }, new Map<string, number>());

    const chartData: lineDataItem[] = [];
    dateMap.forEach((value) => {
      chartData.push({
        value,
      });
    });

    return chartData;
  }, [exercise, workouts]);

  const chartStartY = useMemo(() => {
    if (chartData.length === 0) return 0;
    const values = chartData.map((item) => item.value ?? 0);
    const minValue = Math.min(...values);
    return minValue >= 20 ? minValue - 10 : 0;
  }, [chartData]);

  if (chartData.length < 2) return null;

  return (
    <View onLayout={(e) => setChartWidth(e.nativeEvent.layout.width)}>
      {chartWidth > 0 ? (
        <LineChart
          data={chartData}
          width={chartWidth - 60} // Subtract padding
          height={150}
          noOfSections={4}
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
          yAxisOffset={chartStartY}
          xAxisLabelTextStyle={{
            color: theme.colors.primary,
          }}
        />
      ) : null}
    </View>
  );
};
