import React from "react";

import { Authenticator } from "@aws-amplify/ui-react-native";
import { Stack } from "expo-router";
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from "react-native-paper";
import { DarkModeProvider, useDarkMode } from "@/providers/DarkModeProvider";

// Import the Amplify configuration
import "@/amplifyConfig";
import { signIn } from "aws-amplify/auth";
import { QueryProvider } from "@/providers/QueryProvider";
import { DialogProvider } from "@/providers/DialogProvider";
import { KeyboardAvoidingView, Platform } from "react-native";

// Import dayjs advanced formatting
import advancedFormat from "dayjs/plugin/advancedFormat";
import dayjs from "dayjs";
dayjs.extend(advancedFormat);

const App = () => {
  const { darkMode } = useDarkMode();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <PaperProvider theme={darkMode ? MD3DarkTheme : MD3LightTheme}>
        <DialogProvider>
          <Stack
            screenOptions={{
              header: () => null,
            }}
          />
        </DialogProvider>
      </PaperProvider>
    </KeyboardAvoidingView>
  );
};

export default function RootLayout() {
  return (
    <Authenticator.Provider>
      <Authenticator
        signUpAttributes={["given_name", "family_name"]}
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
