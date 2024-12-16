import { Authenticator } from "@aws-amplify/ui-react-native";
import { Stack } from "expo-router";
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from "react-native-paper";
import { DarkModeProvider, useDarkMode } from "@/providers/DarkModeProvider";

// Import the Amplify configuration
import "@/amplifyConfig";
import { signIn } from "aws-amplify/auth";

const App = () => {
  const { darkMode } = useDarkMode();

  return (
    <PaperProvider theme={darkMode ? MD3DarkTheme : MD3LightTheme}>
      <Stack
        screenOptions={{
          header: () => null,
        }}
      />
    </PaperProvider>
  );
};

export default function RootLayout() {
  return (
    <Authenticator.Provider>
      <Authenticator
        services={{
          handleSignIn: async (input) => {
            // Workaround for a crash when using the default auth flow
            input.options = {
              authFlowType: "USER_PASSWORD_AUTH",
            };
            return await signIn(input);
          },
        }}
      >
        <DarkModeProvider>
          <App />
        </DarkModeProvider>
      </Authenticator>
    </Authenticator.Provider>
  );
}
