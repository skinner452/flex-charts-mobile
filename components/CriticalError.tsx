import { Button, Text } from "react-native-paper";
import { AppView } from "./AppView";
import { usePathname, useRouter } from "expo-router";
import { useAuthenticator } from "@aws-amplify/ui-react-native";
import { useSearchParams } from "expo-router/build/hooks";

export const CriticalError = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const authenticator = useAuthenticator();

  const reload = () => {
    router.replace({
      pathname: pathname as any,
      params: searchParams as any,
    });
  };

  return (
    <AppView style={{ justifyContent: "center", alignItems: "center" }}>
      <Text variant="headlineLarge">Critical Error</Text>
      <Button mode="contained" onPress={() => reload()}>
        Try again
      </Button>
      {router.canGoBack() ? (
        <Button mode="contained" onPress={() => router.back()}>
          Go back
        </Button>
      ) : null}
      <Button mode="contained-tonal" onPress={() => authenticator.signOut()}>
        Log out
      </Button>
    </AppView>
  );
};
