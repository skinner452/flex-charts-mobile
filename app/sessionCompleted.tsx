import { useGetSessionsId } from "@/api/routes/sessions/useGetSessionsId";
import { useGetWorkouts } from "@/api/routes/workouts/useGetWorkouts";
import { AppView } from "@/components/AppView";
import { CriticalError } from "@/components/CriticalError";
import { LoadingScreen } from "@/components/LoadingScreen";
import { pluralize } from "@/utils/pluralize";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import ConfettiCannon from "react-native-confetti-cannon";
import { useSessionDuration } from "@/hooks/useSessionDuration";

export default function Index() {
  const router = useRouter();
  const { sessionID } = useLocalSearchParams<{
    sessionID: string;
  }>();

  const { data: session, isLoading: isSessionLoading } = useGetSessionsId(
    parseInt(sessionID)
  );
  const { data: workouts, isLoading: isWorkoutsLoading } = useGetWorkouts({
    sessionID: parseInt(sessionID),
  });

  const duration = useSessionDuration(session, "pretty");

  if (isSessionLoading || isWorkoutsLoading || !duration) {
    return <LoadingScreen />;
  }

  if (!session || !workouts) {
    return <CriticalError />;
  }

  return (
    <AppView
      style={{
        gap: 32,
        justifyContent: "center",
      }}
    >
      <Text variant="headlineLarge" style={{ textAlign: "center" }}>
        Session complete
      </Text>

      <View style={{ gap: 8 }}>
        <Text variant="titleLarge" style={{ textAlign: "center" }}>
          {duration}
        </Text>
        <Text variant="titleLarge" style={{ textAlign: "center" }}>
          {pluralize("workout", workouts.length)}
        </Text>
      </View>

      <View style={{ gap: 16 }}>
        <Button mode="contained" onPress={() => router.back()}>
          View details
        </Button>
        <Button mode="elevated" onPress={() => router.dismissAll()}>
          Return home
        </Button>
      </View>

      <ConfettiCannon count={300} origin={{ x: 0, y: 0 }} />
    </AppView>
  );
}
