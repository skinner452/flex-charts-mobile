import { AppView } from "@/components/AppView";
import { FooterButtons } from "@/components/FooterButtons";
import { LoadingScreen } from "@/components/LoadingScreen";
import { invalidateQuery, useAPIMutation, useAPIQuery } from "@/hooks/useAPI";
import { Session } from "@/types/sessions";
import { Workout } from "@/types/workouts";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FlatList, View } from "react-native";
import { Button, Divider, IconButton, Text } from "react-native-paper";

export default function Index() {
  const router = useRouter();
  const { sessionID } = useLocalSearchParams<{
    sessionID: string;
  }>();

  const queryClient = useQueryClient();

  const { data: session, refetch: refetchSession } = useAPIQuery<Session>({
    endpoint: `sessions/${sessionID}`,
  });

  const { data: workouts } = useAPIQuery<Workout[]>({
    endpoint: "workouts",
    params: { sessionID },
  });

  const { mutate: deleteWorkout } = useAPIMutation<void>({
    endpoint: "workouts",
    method: "DELETE",
  });

  const { mutate: endSession, isPending: isEndingSession } =
    useAPIMutation<void>({
      endpoint: `sessions/${sessionID}/end`,
      method: "POST",
      onSuccess: () => {
        invalidateQuery(queryClient, {
          endpoint: "sessions",
        });
        router.back();
      },
      onError: () => {
        refetchSession();
      },
    });

  const addWorkout = () => {
    router.navigate({
      pathname: "/addWorkout",
      params: { sessionID },
    });
  };

  if (!session || !workouts) {
    return <LoadingScreen />;
  }

  const isSessionEnded = session.ended_on !== null;

  return (
    <AppView>
      <Text variant="headlineLarge" style={{ textAlign: "center" }}>
        {dayjs(session.created_on).format("MMMM D, YYYY")}
      </Text>
      <FlatList
        data={workouts}
        ItemSeparatorComponent={() => <Divider style={{ marginVertical: 8 }} />}
        renderItem={({ item: workout }) => (
          <View
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
            {isSessionEnded ? null : (
              <IconButton
                icon="delete"
                mode="contained"
                onPress={() => deleteWorkout({ id: workout.id })}
                loading={false} // TODO: Implement loading state for specific workout deletion
              />
            )}
          </View>
        )}
        ListFooterComponent={
          isSessionEnded ? null : (
            <Button
              mode="contained"
              onPress={addWorkout}
              style={{ marginTop: 8 }}
            >
              Add workout
            </Button>
          )
        }
      />
      <FooterButtons
        primaryLabel={isSessionEnded ? "" : "End session"}
        primaryAction={() => endSession({})}
        primaryIsLoading={isEndingSession}
        secondaryLabel="Go back"
        secondaryAction={router.back}
      />
    </AppView>
  );
}
