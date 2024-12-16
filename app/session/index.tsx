import { AppView } from "@/components/AppView";
import { useRouter } from "expo-router";
import { Button, Text, useTheme } from "react-native-paper";

export default function Index() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <AppView>
      <Text>Session</Text>
      <Button onPress={router.back}>Go back</Button>
    </AppView>
  );
}
