import { PropsWithChildren } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

export const FormItem = ({
  label,
  children,
}: PropsWithChildren<{ label: string }>) => {
  return (
    <View style={{ gap: 8 }}>
      <Text variant="labelLarge">{label}</Text>
      {children}
    </View>
  );
};
