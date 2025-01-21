import { PropsWithChildren } from "react";
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";

export const FormItem = ({
  label,
  children,
  error,
}: PropsWithChildren<{ label: string; error?: string }>) => {
  const theme = useTheme();

  return (
    <View style={{ gap: 8 }}>
      <Text variant="labelLarge">{label}</Text>
      {children}
      {error ? (
        <Text variant="labelSmall" style={{ color: theme.colors.error }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
};
