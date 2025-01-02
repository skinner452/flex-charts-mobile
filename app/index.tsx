import { useAuthenticator } from "@aws-amplify/ui-react-native";
import { Button, Text } from "react-native-paper";
import { useUserAttributes } from "@/hooks/useUserAttributes";
import { useDarkMode } from "@/providers/DarkModeProvider";
import { useRouter } from "expo-router";
import { AppView } from "@/components/AppView";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useGetSessions } from "@/api/routes/sessions/useGetSessions";
import { usePostSessions } from "@/api/routes/sessions/usePostSessions";

export default function Index() {
  const authenticator = useAuthenticator();
  const { userAttributes } = useUserAttributes();
  const { toggleDarkMode } = useDarkMode();
  const router = useRouter();

  const { data: activeSessions } = useGetSessions({ isActive: true });
  const { data: pastSessions } = useGetSessions({ isActive: false });

  const postSessions = usePostSessions({
    onSuccess: (session) => {
      router.push({
        pathname: `/session`,
        params: { sessionID: session.id.toString() },
      });
    },
  });

  const createSession = () => {
    postSessions.mutate();
  };

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

  if (!userAttributes || !activeSessions || !pastSessions) {
    return <LoadingScreen />;
  }

  return (
    <AppView
      style={{
        justifyContent: "center",
        alignItems: "center",
        gap: 24,
      }}
    >
      <Text variant="headlineLarge">Welcome {userAttributes?.given_name}!</Text>
      {activeSessions.length > 0 ? (
        <Button mode="contained" icon="play" onPress={resumeSession}>
          Resume session
        </Button>
      ) : (
        <Button
          mode="contained"
          icon="plus"
          onPress={createSession}
          loading={postSessions.isPending}
        >
          Start a new session
        </Button>
      )}

      {pastSessions.length > 0 ? (
        <Button mode="elevated" icon="calendar" onPress={openSessionHistory}>
          Session history
        </Button>
      ) : null}

      <Button onPress={toggleDarkMode} icon="theme-light-dark" mode="elevated">
        Toggle dark mode
      </Button>
      <Button onPress={authenticator.signOut} mode="elevated">
        Sign out
      </Button>
    </AppView>
  );
}
