import { Link, useRootNavigationState, useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function Index() {
  const rootNavigationState = useRootNavigationState();
  const router = useRouter();

  useEffect(() => {
    if (!rootNavigationState?.key) return;

    // If the user is already logged in, redirect to the home page
    if (false) {
      router.replace("/authenticated");
      return;
    }

    // If the user is not logged in, redirect to the login page
    router.replace("/unauthenticated");
  }, [rootNavigationState]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Redirecting...</Text>
    </View>
  );
}
