import { useGetStatsWeekly } from "@/api/routes/stats/useGetStatsWeekly";
import { formatBigNumber } from "@/utils/formatBigNumber";
import { getDateFromDow } from "@/utils/getDateFromDow";
import { round } from "@/utils/round";
import React, { useMemo } from "react";
import { View } from "react-native";
import { ActivityIndicator, Text, useTheme } from "react-native-paper";

export const WeeklyStats = () => {
  const weekStart = useMemo(() => getDateFromDow(1), []);

  const { data, isFetching } = useGetStatsWeekly({
    weekStart: weekStart.toISOString(),
  });

  if (isFetching) {
    return <ActivityIndicator size="small" />;
  }

  if (!data) {
    return null;
  }

  return (
    <View style={{ width: "100%", alignItems: "center", gap: 8 }}>
      <Text variant="labelSmall">
        Week of {weekStart.format("MMMM Do, YYYY")}
      </Text>
      <View style={{ flexDirection: "row", gap: 16 }}>
        <StatBox
          title="Sessions"
          total={data.sessions}
          change={data.sessionsChange}
          changePct={data.sessionsChangePct}
        />
        <StatBox
          title="Weight"
          total={data.weight}
          change={data.weightChange}
          changePct={data.weightChangePct}
        />
        <StatBox
          title="Distance"
          total={data.distance}
          change={data.distanceChange}
          changePct={data.distanceChangePct}
        />
      </View>
    </View>
  );
};

const StatBox = (props: {
  title: string;
  total: number;
  change: number;
  changePct: number;
}) => {
  const theme = useTheme();

  const color = useMemo(() => {
    if (props.change === 0) return theme.colors.outline;

    return props.change > 0 ? theme.colors.primary : theme.colors.error;
  }, [props.change, theme]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.elevation.level5,
        padding: 12,
        borderRadius: 12,
        alignItems: "center",
      }}
    >
      <Text variant="labelSmall">{props.title}</Text>
      <Text variant="headlineMedium">{formatBigNumber(props.total)}</Text>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          gap: 4,
          justifyContent: "space-between",
        }}
      >
        <Text style={{ color }} variant="labelSmall">
          {props.change === 0
            ? "-"
            : `${props.change > 0 ? "+" : ""} ${formatBigNumber(props.change)}`}
        </Text>
        <Text style={{ color }} variant="labelSmall">
          {props.changePct === 0
            ? "-"
            : `${props.changePct > 0 ? "+" : ""} ${formatBigNumber(
                round(props.changePct * 100)
              )}%`}
        </Text>
      </View>
    </View>
  );
};
