import React from "react";

import { View } from "react-native";
import { Icon, Text, TouchableRipple, useTheme } from "react-native-paper";

type Props = {
  name: string;
  description: string;
  icon: string;
  selected?: boolean;
  onPress?: () => void;
};

export const ExerciseType = ({
  name,
  description,
  icon,
  selected,
  onPress,
}: Props) => {
  const theme = useTheme();

  return (
    <TouchableRipple onPress={() => onPress?.()}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          backgroundColor: selected ? theme.colors.primaryContainer : undefined,
          padding: 12,
          borderRadius: 16,
        }}
      >
        <Icon source={icon} size={40} />
        <View style={{ flex: 1 }}>
          <Text variant="headlineSmall">{name}</Text>
          <Text variant="labelSmall">{description}</Text>
        </View>
      </View>
    </TouchableRipple>
  );
};
