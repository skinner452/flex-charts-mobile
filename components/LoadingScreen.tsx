import { ActivityIndicator } from "react-native-paper";
import { AppView } from "./AppView";

export const LoadingScreen = () => {
  return (
    <AppView
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" />
    </AppView>
  );
};
