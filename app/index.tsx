import { useAuthenticator } from "@aws-amplify/ui-react-native";
import { Button, Text } from "react-native-paper";
import { useUserAttributes } from "@/hooks/useUserAttributes";
import { useDarkMode } from "@/providers/DarkModeProvider";
import { useRouter } from "expo-router";
import { AppView } from "@/components/AppView";

export default function Index() {
  const authenticator = useAuthenticator();
  const userAttributes = useUserAttributes();
  const { toggleDarkMode } = useDarkMode();
  const router = useRouter();

  return (
    <AppView
      style={{
        justifyContent: "center",
        alignItems: "center",
        gap: 24,
      }}
    >
      <Text variant="headlineLarge">Welcome {userAttributes?.given_name}!</Text>
      <Button
        mode="contained"
        icon="plus"
        onPress={() => router.push("/session")}
      >
        Start a new session
      </Button>
      <Button onPress={toggleDarkMode} icon="theme-light-dark" mode="elevated">
        Toggle dark mode
      </Button>
      <Button onPress={authenticator.signOut} mode="elevated">
        Sign out
      </Button>
    </AppView>
  );
}
