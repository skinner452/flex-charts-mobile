import { useCallback, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import {
  Button,
  IconButton,
  Text,
  TextInput,
  TouchableRipple,
  useTheme,
} from "react-native-paper";

type Props = {
  step?: number; // Default to 1
  value: string;
  setValue: (value: string) => void;
  min?: number; // Default to 0
};

export const NumericStepInput = (props: Props) => {
  const min = useMemo(() => {
    return props.min ?? 0;
  }, [props.min]);

  const step = useMemo(() => {
    return props.step ?? 1;
  }, [props.step]);

  const numberValue = useMemo(() => {
    if (props.value === "") return 0;
    const parsed = parseInt(props.value);
    if (isNaN(parsed)) return 0;
    return parsed;
  }, [props.value]);

  const setNumberValue = useCallback(
    (value: number) => {
      if (value < min) value = min;
      props.setValue(value.toString());
    },
    [props.setValue]
  );

  return (
    <View style={{ flexDirection: "row", gap: 16 }}>
      <TextInput
        keyboardType="numeric"
        onChangeText={(value) => props.setValue(value)}
        value={props.value}
        returnKeyType="done"
        style={{ flex: 1 }}
      />

      <StepButton
        onPress={() => setNumberValue(numberValue - step)}
        label={`-${step}`}
        disabled={numberValue <= min}
      />

      <StepButton
        onPress={() => setNumberValue(numberValue + step)}
        label={`+${step}`}
      />
    </View>
  );
};

const StepButton = (props: {
  onPress: () => void;
  label: string;
  disabled?: boolean;
}) => {
  const theme = useTheme();

  return (
    <TouchableRipple
      disabled={props.disabled}
      onPress={() => props.onPress()}
      style={{
        backgroundColor: props.disabled
          ? theme.colors.elevation.level1
          : theme.colors.elevation.level3,
        justifyContent: "center",
        paddingHorizontal: 20,
        borderRadius: 20,
      }}
    >
      <Text
        variant="titleSmall"
        style={{
          color: props.disabled
            ? theme.colors.inversePrimary
            : theme.colors.primary,
        }}
      >
        {props.label}
      </Text>
    </TouchableRipple>
  );
};
