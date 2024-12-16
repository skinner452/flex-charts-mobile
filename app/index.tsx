import { Text, View } from "react-native";

import { useAuthenticator } from "@aws-amplify/ui-react-native";
import { Button } from "@aws-amplify/ui-react-native/dist/primitives";
import { useAPI } from "@/hooks/useAPI";

export default function Index() {
  const authenticator = useAuthenticator();
  const apiClient = useAPI();

  const getMachines = () => {
    apiClient
      .get("machines")
      .then(async (response) => {
        const data = await response.json();
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
      <Button onPress={getMachines}>Get machines</Button>
      <Button onPress={authenticator.signOut}>Sign out</Button>
    </View>
  );
}
