import { Authenticator } from "@aws-amplify/ui-react-native";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native";

// Import the Amplify configuration
import "@/amplifyConfig";
import { signIn } from "aws-amplify/auth";

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
        <SafeAreaView style={{ flex: 1 }}>
          <Stack
            screenOptions={{
              header: () => null,
            }}
          />
        </SafeAreaView>
      </Authenticator>
    </Authenticator.Provider>
  );
}
