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
import { setPastSessions } from "@/redux/slices/pastSessions";

export default function Index() {
  const authenticator = useAuthenticator();
  const { userAttributes, userAttributesLoading } = useUserAttributes();
  const { toggleDarkMode } = useDarkMode();
  const router = useRouter();
  const apiClient = useAPI();

  const activeSession = useAppSelector((state) => state.activeSession);
  const pastSessions = useAppSelector((state) => state.pastSessions);
  const dispatch = useAppDispatch();

  const [activeSessionLoading, setActiveSessionLoading] = useState(true);
  const [pastSessionsLoading, setPastSessionsLoading] = useState(true);
  const [exercisesLoading, setExercisesLoading] = useState(true);
  const [creatingSession, setCreatingSession] = useState(false);

  useEffect(() => {
    apiClient
      .get("sessions?isActive=1&limit=1")
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
    apiClient
      .get("sessions?isActive=0")
      .then(async (sessions: Session[]) => {
        if (sessions.length > 0) {
          dispatch(setPastSessions(sessions));
        }
      })
      .catch((error) => {
        console.error("Failed to load past sessions", error);
      })
      .finally(() => {
        setPastSessionsLoading(false);
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

  const openSessionHistory = async () => {
    router.push({
      pathname: `/sessionHistory`,
    });
  };

  if (
    userAttributesLoading ||
    activeSessionLoading ||
    exercisesLoading ||
    pastSessionsLoading
  ) {
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
