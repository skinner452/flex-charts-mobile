import { useDeleteSessionsId } from "@/api/routes/sessions/useDeleteSessionsId";
import { useGetSessionsId } from "@/api/routes/sessions/useGetSessionsId";
import { usePostSessionsIdEnd } from "@/api/routes/sessions/usePostSessionsIdEnd";
import { useDeleteWorkoutsId } from "@/api/routes/workouts/useDeleteWorkoutsId";
import { useGetWorkouts } from "@/api/routes/workouts/useGetWorkouts";
import { AppView } from "@/components/AppView";
import { FooterButtons } from "@/components/FooterButtons";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useDialog } from "@/providers/DialogProvider";
import dayjs from "dayjs";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FlatList, View } from "react-native";
import { Button, Divider, IconButton, Text } from "react-native-paper";

export default function Index() {
  const router = useRouter();
  const { sessionID } = useLocalSearchParams<{
    sessionID: string;
  }>();

  const { data: session } = useGetSessionsId(parseInt(sessionID));
  const { data: workouts } = useGetWorkouts({
    sessionID: parseInt(sessionID),
  });

  const { createDialog } = useDialog();

  const {
    mutate: deleteWorkout,
    variables: deletingWorkout,
    isPending: isDeletingWorkout,
  } = useDeleteWorkoutsId({
    onError: (error) => {
      console.error(error);
    },
  });

  const { mutateAsync: endSessionAsync, isPending: isEndingSession } =
    usePostSessionsIdEnd(parseInt(sessionID), {
      onSuccess: () => {
        router.back();
      },
      onError: (error) => {
        console.error(error);
      },
    });

  const { mutateAsync: deleteSessionAsync } = useDeleteSessionsId(
    parseInt(sessionID),
    {
      onSuccess: () => {
        router.back();
      },
      onError: (error) => {
        console.error(error);
      },
    }
  );

  const endSession = () => {
    if (workouts && workouts.length === 0) {
      // Prompt user to delete the session instead
      createDialog({
        title: "Empty session",
        content: "This session has no workouts. How would you like to proceed?",
        actions: [
          {
            label: "Cancel",
            callback: () => {},
          },
          {
            label: "End session",
            callback: async () => await endSessionAsync(),
          },
          {
            label: "Delete session",
            callback: async () => await deleteSessionAsync(),
          },
        ],
      });
    } else {
      endSessionAsync();
    }
  };

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
                onPress={() => deleteWorkout(workout)}
                loading={isDeletingWorkout && deletingWorkout.id === workout.id}
                disabled={
                  isDeletingWorkout && deletingWorkout.id === workout.id
                }
              />
            )}
          </View>
        )}
        ListFooterComponent={
          isSessionEnded ? null : (
            <Button
              mode="contained"
              onPress={() => addWorkout()}
              style={{ marginTop: 8 }}
            >
              Add workout
            </Button>
          )
        }
      />
      <FooterButtons
        primaryLabel={isSessionEnded ? "" : "End session"}
        primaryAction={endSession}
        primaryIsLoading={isEndingSession}
        secondaryLabel="Go back"
        secondaryAction={router.back}
      />
    </AppView>
  );
}
