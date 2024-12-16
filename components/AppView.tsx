import React, { PropsWithChildren } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

export const AppView: React.FC<Props> = ({ children, style }) => {
  const theme = useTheme();

  return (
    <SafeAreaView
      style={[
        { flex: 1, padding: 12, backgroundColor: theme.colors.background },
        style,
      ]}
    >
      {children}
    </SafeAreaView>
  );
};
