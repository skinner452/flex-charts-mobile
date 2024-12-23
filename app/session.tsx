import { AppView } from "@/components/AppView";
import { FooterButtons } from "@/components/FooterButtons";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useAPI } from "@/hooks/useAPI";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  deleteSessionWorkout,
  setSessionWorkouts,
} from "@/redux/slices/sessionWorkouts";
import { Session } from "@/types/sessions";
import { Workout } from "@/types/workouts";
import dayjs from "dayjs";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Button, IconButton, Text, useTheme } from "react-native-paper";

export default function Index() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { session_id } = params;

  const sessionWorkouts = useAppSelector((state) => state.sessionWorkouts);
  const dispatch = useAppDispatch();

  const apiClient = useAPI();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    apiClient
      .get(`sessions/${session_id}`)
      .then(async (session: Session) => {
        setSession(session);
      })
      .catch(() => {
        router.back();
      });
  }, []);

  useEffect(() => {
    apiClient
      .get(`workouts?session_id=${session_id}`)
      .then(async (workouts: Workout[]) => {
        dispatch(setSessionWorkouts(workouts));
      })
      .catch(() => {
        router.back();
      });

    return () => {
      // Cleanup redux state when unmounting
      dispatch(setSessionWorkouts([]));
    };
  }, []);

  const addWorkout = () => {
    router.navigate({
      pathname: "/addWorkout",
      params: {
        session_id: session_id,
      },
    });
  };

  const deleteWorkout = (workoutID: number) => {
    apiClient
      .del(`workouts/${workoutID}`)
      .then(() => {
        dispatch(deleteSessionWorkout(workoutID));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  if (session === null) return <LoadingScreen />;

  return (
    <AppView style={{ gap: 16 }}>
      <Text variant="headlineLarge" style={{ textAlign: "center" }}>
        {dayjs(session.created_on).format("MMMM D, YYYY")}
      </Text>
      <View style={{ flex: 1, gap: 16 }}>
        {sessionWorkouts.map((workout) => (
          <View
            key={workout.id}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Text variant="bodyLarge" style={{ flex: 1, fontWeight: "bold" }}>
              {workout.exercise.name}
            </Text>
            <Text variant="bodyLarge">
              {workout.weight} lbs x {workout.reps} reps x {workout.sets} sets
            </Text>
            <IconButton
              icon="delete"
              mode="contained"
              onPress={() => deleteWorkout(workout.id)}
            />
          </View>
        ))}
        <Button mode="contained" onPress={addWorkout}>
          Add workout
        </Button>
      </View>
      <FooterButtons
        primaryLabel="End session"
        primaryAction={() => {}}
        secondaryLabel="Go back"
        secondaryAction={router.back}
      />
    </AppView>
  );
}
