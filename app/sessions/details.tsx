import { useDeleteSessionsId } from "@/api/routes/sessions/useDeleteSessionsId";
import { useGetSessionsId } from "@/api/routes/sessions/useGetSessionsId";
import { usePostSessionsIdEnd } from "@/api/routes/sessions/usePostSessionsIdEnd";
import { useGetWorkouts } from "@/api/routes/workouts/useGetWorkouts";
import { AppView } from "@/components/AppView";
import { CriticalError } from "@/components/CriticalError";
import { FlashListWithLoading } from "@/components/FlashListWithLoading";
import { FooterButtons } from "@/components/FooterButtons";
import { LoadingScreen } from "@/components/LoadingScreen";
import { SessionWorkoutRow } from "@/components/SessionWorkoutRow";
import { useSessionDuration } from "@/hooks/useSessionDuration";
import { useDialog } from "@/providers/DialogProvider";
import dayjs from "dayjs";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View } from "react-native";
import { Button, Divider, Text } from "react-native-paper";

export default function Index() {
  const router = useRouter();
  const { sessionID } = useLocalSearchParams<{
    sessionID: string;
  }>();

  const { data: session, isFetching: isSessionFetching } = useGetSessionsId(
    parseInt(sessionID)
  );
  const { data: workouts, isFetching: isWorkoutsFetching } = useGetWorkouts({
    sessionID: parseInt(sessionID),
    sort: "created_on",
  });

  const duration = useSessionDuration(session, "ticker");

  const { createDialog } = useDialog();

  const { mutateAsync: endSessionAsync, isPending: isEndingSession } =
    usePostSessionsIdEnd(parseInt(sessionID), {
      onSuccess: () => {
        router.navigate({
          pathname: "/sessions/completed",
          params: { sessionID },
        });
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

  const deleteSession = () => {
    createDialog({
      title: "Delete session",
      content: "Are you sure you want to delete this session?",
      actions: [
        {
          label: "Cancel",
        },
        {
          label: "Delete",
          callback: async () => await deleteSessionAsync(),
        },
      ],
    });
  };

  const addWorkout = () => {
    router.navigate({
      pathname: "/workouts/create",
      params: { sessionID },
    });
  };

  if (isSessionFetching) {
    return <LoadingScreen />;
  }

  if (!session || !workouts) {
    return <CriticalError />;
  }

  const isSessionEnded = session.ended_on !== null;

  return (
    <AppView>
      <View style={{ alignItems: "center" }}>
        <Text variant="headlineLarge">
          {dayjs(session.created_on).format("MMMM D, YYYY")}
        </Text>
        <Text variant="labelLarge">
          {dayjs(session.created_on).format("h:mm A")}
          {isSessionEnded
            ? ` - ${dayjs(session.ended_on).format("h:mm A")}`
            : ""}
        </Text>
        <Text variant="labelLarge">{duration}</Text>
      </View>
      <Divider />
      <FlashListWithLoading
        isLoading={isWorkoutsFetching}
        estimatedItemSize={80}
        data={workouts}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({ item: workout }) => (
          <SessionWorkoutRow workout={workout} canDelete={!isSessionEnded} />
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
        primaryLabel={isSessionEnded ? "Delete Session" : "End session"}
        primaryAction={() => (isSessionEnded ? deleteSession() : endSession())}
        primaryIsLoading={isEndingSession}
        secondaryLabel="Go back"
        secondaryAction={router.back}
      />
    </AppView>
  );
}
