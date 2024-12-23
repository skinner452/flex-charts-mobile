import { useAuthenticator } from "@aws-amplify/ui-react-native";
import { Button, Text } from "react-native-paper";
import { useUserAttributes } from "@/hooks/useUserAttributes";
import { useDarkMode } from "@/providers/DarkModeProvider";
import { useRouter } from "expo-router";
import { AppView } from "@/components/AppView";
import { useAPI } from "@/hooks/useAPI";
import { useEffect, useState } from "react";
import { Session } from "@/types/sessions";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setExercises } from "@/redux/slices/exercises";
import { Exercise } from "@/types/exercises";
import { setActiveSession } from "@/redux/slices/activeSession";

export default function Index() {
  const authenticator = useAuthenticator();
  const { userAttributes, userAttributesLoading } = useUserAttributes();
  const { toggleDarkMode } = useDarkMode();
  const router = useRouter();
  const apiClient = useAPI();

  const activeSession = useAppSelector((state) => state.activeSession);
  const dispatch = useAppDispatch();

  const [activeSessionLoading, setActiveSessionLoading] = useState(true);
  const [exercisesLoading, setExercisesLoading] = useState(true);
  const [creatingSession, setCreatingSession] = useState(false);

  useEffect(() => {
    apiClient
      .get("sessions?isActive=1")
      .then(async (sessions: Session[]) => {
        if (sessions.length > 0) {
          dispatch(setActiveSession(sessions[0]));
        }
      })
      .catch((error) => {
        console.error("Failed to load active session", error);
      })
      .finally(() => {
        setActiveSessionLoading(false);
      });
  }, []);

  useEffect(() => {
    // Load all exercises for redux
    apiClient
      .get("exercises")
      .then(async (exercises: Exercise[]) => {
        dispatch(setExercises(exercises));
      })
      .catch((error) => {
        console.error("Failed to load exercises", error);
      })
      .finally(() => {
        setExercisesLoading(false);
      });
  }, []);

  const startNewSession = async () => {
    setCreatingSession(true);
    apiClient
      .post("sessions")
      .then(async (session: Session) => {
        dispatch(setActiveSession(session));
        router.push({
          pathname: `/session`,
        });
      })
      .catch((error) => {
        console.error("Failed to create session", error);
      })
      .finally(() => {
        setCreatingSession(false);
      });
  };

  const resumeSession = async () => {
    router.push({
      pathname: `/session`,
    });
  };

  if (userAttributesLoading || activeSessionLoading || exercisesLoading) {
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
      {activeSession ? (
        <Button mode="contained" icon="play" onPress={resumeSession}>
          Resume session
        </Button>
      ) : (
        <Button
          mode="contained"
          icon="plus"
          onPress={startNewSession}
          loading={creatingSession}
        >
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
