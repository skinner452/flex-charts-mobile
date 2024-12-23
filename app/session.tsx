import { AppView } from "@/components/AppView";
import { FooterButtons } from "@/components/FooterButtons";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useAPI } from "@/hooks/useAPI";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  clearActiveSession,
  setActiveSession,
} from "@/redux/slices/activeSession";
import {
  deleteSessionWorkout,
  setSessionWorkouts,
} from "@/redux/slices/sessionWorkouts";
import { Workout } from "@/types/workouts";
import dayjs from "dayjs";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import {
  Button,
  Divider,
  IconButton,
  Text,
  useTheme,
} from "react-native-paper";

export default function Index() {
  const router = useRouter();

  const sessionWorkouts = useAppSelector((state) => state.sessionWorkouts);
  const activeSession = useAppSelector((state) => state.activeSession);
  const dispatch = useAppDispatch();

  const apiClient = useAPI();

  const [deletingWorkoutID, setDeletingWorkoutID] = useState<number | null>(
    null
  );
  const [endingSession, setEndingSession] = useState(false);

  useEffect(() => {
    apiClient
      .get(`workouts?sessionID=${activeSession?.id}`)
      .then(async (workouts: Workout[]) => {
        dispatch(setSessionWorkouts(workouts));
      })
      .catch((error) => {
        console.error("Failed to load workouts", error);
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
    });
  };

  const deleteWorkout = (workoutID: number) => {
    setDeletingWorkoutID(workoutID);
    apiClient
      .del(`workouts/${workoutID}`)
      .then(() => {
        dispatch(deleteSessionWorkout(workoutID));
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setDeletingWorkoutID(null);
      });
  };

  const endSession = () => {
    setEndingSession(true);
    apiClient
      .post(`sessions/${activeSession?.id}/end`)
      .then(() => {
        dispatch(clearActiveSession());
        router.back();
      })
      .catch((error) => {
        console.error("Failed to end session", error);
      })
      .finally(() => {
        setEndingSession(false);
      });
  };

  if (activeSession === null) return <LoadingScreen />;

  return (
    <AppView style={{ gap: 16 }}>
      <Text variant="headlineLarge" style={{ textAlign: "center" }}>
        {dayjs(activeSession.created_on).format("MMMM D, YYYY")}
      </Text>
      <FlatList
        data={sessionWorkouts}
        ItemSeparatorComponent={() => <Divider style={{ marginVertical: 8 }} />}
        renderItem={({ item: workout }) => (
          <View
            key={workout.id}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
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
              loading={deletingWorkoutID === workout.id}
            />
          </View>
        )}
        ListFooterComponent={
          <Button
            mode="contained"
            onPress={addWorkout}
            style={{ marginTop: 8 }}
          >
            Add workout
          </Button>
        }
      />
      <FooterButtons
        primaryLabel="End session"
        primaryAction={() => endSession()}
        primaryIsLoading={endingSession}
        secondaryLabel="Go back"
        secondaryAction={router.back}
      />
    </AppView>
  );
}
