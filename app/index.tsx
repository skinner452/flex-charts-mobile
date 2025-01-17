import { useAuthenticator } from "@aws-amplify/ui-react-native";
import { Button, FAB, Text } from "react-native-paper";
import { useUserAttributes } from "@/hooks/useUserAttributes";
import { useDarkMode } from "@/providers/DarkModeProvider";
import { useRouter } from "expo-router";
import { AppView } from "@/components/AppView";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useGetSessions } from "@/api/routes/sessions/useGetSessions";
import { usePostSessions } from "@/api/routes/sessions/usePostSessions";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CriticalError } from "@/components/CriticalError";
import { useQueryClient } from "@tanstack/react-query";

export default function Index() {
  const authenticator = useAuthenticator();
  const { userAttributes, userAttributesLoading } = useUserAttributes();
  const { toggleDarkMode } = useDarkMode();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: activeSessions, isLoading: isActiveSessionsLoading } =
    useGetSessions({ isActive: true });
  const { data: pastSessions, isLoading: isPastSessionsLoading } =
    useGetSessions({ isActive: false });

  const { mutate: createSession, isPending: isCreatingSession } =
    usePostSessions({
      onSuccess: (session) => {
        router.navigate({
          pathname: `/sessionDetails`,
          params: { sessionID: session.id.toString() },
        });
      },
      onError: (error) => {
        console.error(error);
      },
    });

  const resumeSession = async () => {
    if (!activeSessions || activeSessions.length === 0) return;

    router.navigate({
      pathname: `/sessionDetails`,
      params: { sessionID: activeSessions[0].id.toString() },
    });
  };

  const openSessionHistory = async () => {
    router.navigate({
      pathname: `/sessionHistory`,
    });
  };

  const openExerciseList = async () => {
    router.push({
      pathname: `/exerciseList`,
    });
  };

  const signOut = async () => {
    await authenticator.signOut();

    // Clear the query cache after signing out
    // Adding this delay prevents the queries from being refetched automatically
    setTimeout(() => queryClient.clear(), 1000);
  };

  if (
    userAttributesLoading ||
    isActiveSessionsLoading ||
    isPastSessionsLoading
  ) {
    return <LoadingScreen />;
  }

  if (!userAttributes || !activeSessions || !pastSessions) {
    return <CriticalError />;
  }

  return (
    <AppView
      style={{
        justifyContent: "center",
        alignItems: "center",
        gap: 24,
      }}
    >
      <FAB
        icon="theme-light-dark"
        onPress={() => toggleDarkMode()}
        style={{
          position: "absolute",
          right: insets.right,
          top: insets.top,
          margin: 16,
        }}
      />

      <Text variant="headlineLarge">Welcome {userAttributes.given_name}!</Text>
      {activeSessions.length > 0 ? (
        <Button mode="contained" icon="play" onPress={() => resumeSession()}>
          Resume session
        </Button>
      ) : (
        <Button
          mode="contained"
          icon="plus"
          onPress={() => createSession()}
          loading={isCreatingSession}
          disabled={isCreatingSession}
        >
          Start a new session
        </Button>
      )}

      {pastSessions.length > 0 ? (
        <Button
          mode="elevated"
          icon="calendar"
          onPress={() => openSessionHistory()}
        >
          Session history
        </Button>
      ) : null}

      <Button
        mode="elevated"
        icon="weight-lifter"
        onPress={() => openExerciseList()}
      >
        Exercises
      </Button>

      <Button icon="logout" onPress={() => signOut()} mode="elevated">
        Sign out
      </Button>
    </AppView>
  );
}
