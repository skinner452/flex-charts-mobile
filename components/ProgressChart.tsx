import { useGetWorkouts } from "@/api/routes/workouts/useGetWorkouts";
import { ExerciseTypeID } from "@/types/exercise_types";
import { Exercise } from "@/types/exercises";
import { useFont } from "@shopify/react-native-skia";
import dayjs from "dayjs";
import React, { useCallback, useMemo } from "react";
import { View } from "react-native";
import { useTheme } from "react-native-paper";
import { CartesianChart, Line } from "victory-native";

import Roboto from "../assets/fonts/Roboto.ttf";

type Props = {
  exercise: Exercise;
};

type ChartData = {
  day: number;
  value: number;
};

export const ProgressChart = ({ exercise }: Props) => {
  const theme = useTheme();
  const font = useFont(Roboto, 12);

  const { data: workouts } = useGetWorkouts({
    exerciseID: exercise.id,
    sort: "created_on",
  });

  const minDate = useMemo(() => {
    if (!workouts) return null;
    return dayjs(workouts[0].created_on).startOf("day");
  }, [workouts]);

  const chartData = useMemo(() => {
    if (!workouts || !minDate) return [];

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

    const data = workouts.reduce((acc, workout) => {
      const day = dayjs(workout.created_on).diff(minDate, "day");
      const value = workout[col] ?? 0;
      acc.push({ day, value });
      return acc;
    }, [] as ChartData[]);

    return data;
  }, [exercise, workouts, minDate]);

  const formatXLabel = useCallback(
    (value: number) => {
      if (!minDate) return "";
      const date = minDate.add(value, "day");
      return date?.format("MMM D") ?? "";
    },
    [minDate]
  );

  if (chartData.length < 2) return null;

  return (
    <View style={{ height: 200 }}>
      <CartesianChart
        data={chartData}
        xKey={"day"}
        yKeys={["value"]}
        axisOptions={{
          font,
          labelColor: theme.colors.inverseSurface,
          lineColor: theme.colors.inversePrimary,
          formatXLabel,
        }}
        padding={10}
        domainPadding={{ left: 0, right: 20, top: 10, bottom: 10 }}
      >
        {/* 👇 render function exposes various data, such as points. */}
        {({ points }) => (
          <Line
            points={points.value}
            color={theme.colors.primary}
            strokeWidth={3}
            curveType="linear"
          />
        )}
      </CartesianChart>
    </View>
  );
};
