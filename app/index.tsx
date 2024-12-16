import { useRootNavigationState, useRouter } from "expo-router";
import { Text, View } from "react-native";

import { useAuthenticator } from "@aws-amplify/ui-react-native";
import { Button } from "@aws-amplify/ui-react-native/dist/primitives";

export default function Index() {
  const authenticator = useAuthenticator();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Home page!</Text>
      <Text>Welcome {authenticator.user.userId}</Text>
      <Button onPress={authenticator.signOut}>Sign out</Button>
    </View>
  );
}
