import { useAuthenticator } from "@aws-amplify/ui-react-native";
import { Button, Text } from "react-native-paper";
import { useUserAttributes } from "@/hooks/useUserAttributes";
import { useDarkMode } from "@/providers/DarkModeProvider";
import { useRouter } from "expo-router";
import { AppView } from "@/components/AppView";
import { useAPI } from "@/hooks/useAPI";
import { useEffect, useState } from "react";
import { Session } from "@/types/sessions";

export default function Index() {
  const authenticator = useAuthenticator();
  const userAttributes = useUserAttributes();
  const { toggleDarkMode } = useDarkMode();
  const router = useRouter();
  const apiClient = useAPI();
  const [activeSession, setActiveSession] = useState<Session | null>(null);

  useEffect(() => {
    apiClient.get("sessions?is_active=1").then(async (response) => {
      const sessions = (await response.json()) as Session[];
      setActiveSession(sessions[0]);
    });
  }, []);

  const startNewSession = async () => {
    const response = await apiClient.post("sessions");
    const session = (await response.json()) as Session;
    setActiveSession(session);
    router.push(`/session`);
  };

  const resumeSession = async () => {
    router.push(`/session`);
  };

  return (
    <AppView
      style={{
        justifyContent: "center",
        alignItems: "center",
        gap: 24,
      }}
    >
      <Text variant="headlineLarge">Welcome {userAttributes?.given_name}!</Text>
      {activeSession ? (
        <Button mode="contained" icon="play" onPress={resumeSession}>
          Resume session
        </Button>
      ) : (
        <Button mode="contained" icon="plus" onPress={startNewSession}>
          Start a new session
        </Button>
      )}

      <Button onPress={toggleDarkMode} icon="theme-light-dark" mode="elevated">
        Toggle dark mode
      </Button>
      <Button onPress={authenticator.signOut} mode="elevated">
        Sign out
      </Button>
    </AppView>
  );
}
