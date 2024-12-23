import { View } from "react-native";
import { Text, TextInput, TextInputProps } from "react-native-paper";

type Props = TextInputProps & {
  units: string;
};

export const TextInputWithUnits = ({ units, ...rest }: Props) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <TextInput style={{ flex: 1 }} {...rest} />
      <Text>{units}</Text>
    </View>
  );
};
