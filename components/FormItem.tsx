import { REQUIRED_ERROR } from "@/hooks/useValidation";
import { PropsWithChildren, useMemo } from "react";
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";

type Props = PropsWithChildren<{
  label: string;
  error?: string;
}>;

export const FormItem = ({ label, children, error }: Props) => {
  const theme = useTheme();

  const isRequiredError = useMemo(() => {
    return error === REQUIRED_ERROR;
  }, [error]);

  return (
    <View style={{ gap: 8 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text variant="labelLarge">{label}</Text>
        {isRequiredError ? (
          <Text variant="labelSmall" style={{ color: theme.colors.error }}>
            Required
          </Text>
        ) : null}
      </View>

      {children}
      {error && !isRequiredError ? (
        <Text variant="labelSmall" style={{ color: theme.colors.error }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
};
