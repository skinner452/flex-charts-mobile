import { Authenticator } from "@aws-amplify/ui-react-native";
import { Stack } from "expo-router";
import {
  PaperProvider,
  MD3LightTheme,
  MD3DarkTheme,
  Portal,
} from "react-native-paper";
import { DarkModeProvider, useDarkMode } from "@/providers/DarkModeProvider";

// Import the Amplify configuration
import "@/amplifyConfig";
import { signIn } from "aws-amplify/auth";
import { QueryProvider } from "@/providers/QueryProvider";
import { DialogProvider } from "@/providers/DialogProvider";

const App = () => {
  const { darkMode } = useDarkMode();

  return (
    <PaperProvider theme={darkMode ? MD3DarkTheme : MD3LightTheme}>
      <DialogProvider>
        <Stack
          screenOptions={{
            header: () => null,
          }}
        />
      </DialogProvider>
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
        <QueryProvider>
          <DarkModeProvider>
            <App />
          </DarkModeProvider>
        </QueryProvider>
      </Authenticator>
    </Authenticator.Provider>
  );
}
