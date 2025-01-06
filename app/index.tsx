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

export default function Index() {
  const authenticator = useAuthenticator();
  const { userAttributes, userAttributesLoading } = useUserAttributes();
  const { toggleDarkMode } = useDarkMode();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { data: activeSessions, isLoading: isActiveSessionsLoading } =
    useGetSessions({ isActive: true });
  const { data: pastSessions, isLoading: isPastSessionsLoading } =
    useGetSessions({ isActive: false });

  const { mutate: createSession, isPending: isCreatingSession } =
    usePostSessions({
      onSuccess: (session) => {
        router.push({
          pathname: `/session`,
          params: { sessionID: session.id.toString() },
        });
      },
      onError: (error) => {
        console.error(error);
      },
    });

  const resumeSession = async () => {
    if (!activeSessions || activeSessions.length === 0) return;

    router.push({
      pathname: `/session`,
      params: { sessionID: activeSessions[0].id.toString() },
    });
  };

  const openSessionHistory = async () => {
    router.push({
      pathname: `/sessionHistory`,
    });
  };

  if (
    userAttributesLoading ||
    isActiveSessionsLoading ||
    isPastSessionsLoading
  ) {
    return <LoadingScreen />;
  }

  // TODO: Handle error states
  if (!userAttributes || !activeSessions || !pastSessions) {
    return null;
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

      <Text variant="headlineLarge">Welcome {userAttributes?.given_name}!</Text>
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

      <Button onPress={() => authenticator.signOut()} mode="elevated">
        Sign out
      </Button>
    </AppView>
  );
}
