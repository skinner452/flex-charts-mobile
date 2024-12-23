import { Text } from "react-native-paper";
import { AppView } from "./AppView";

export const LoadingScreen = () => {
  return (
    <AppView
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text variant="displayLarge">Loading...</Text>
    </AppView>
  );
};
